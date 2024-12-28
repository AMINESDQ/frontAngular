pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        KUBE_FILES_PATH = '/home/azureuser/k8s_Repo'
        DOCKER_IMAGE_NAME = 'sadiqmohamedamine/sadiqfront'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Clonage du dépôt Git..."
                checkout scm
            }
        }

        stage('Build & Push Docker Image') {
            when {
                changeset "**/frontend/**"
            }
            steps {
                dir('frontend') {
                    script {
                        echo "Construction de l'image Docker..."
                        def image = docker.build("${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}")
                        
                        echo "Connexion au registre Docker..."
                        sh "echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin"

                        echo "Push de l'image Docker..."
                        image.push()
                    }
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            when {
                changeset "**/frontend/**"
            }
            steps {
                script {
                    echo "Mise à jour du fichier de déploiement Kubernetes..."
                    sh """
                        sed -i 's|sadiqmohamedamine/sadiqfront:.*|${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}|' \
                        ${KUBE_FILES_PATH}/frontend-deployment.yaml
                    """

                    echo "Validation des fichiers YAML Kubernetes..."
                    sh """
                        minikube kubectl -- apply --dry-run=client -f ${KUBE_FILES_PATH}/frontend-deployment.yaml
                        minikube kubectl -- apply --dry-run=client -f ${KUBE_FILES_PATH}/frontend-service.yaml
                    """

                    echo "Application des fichiers de configuration Kubernetes..."
                    sh """
                        minikube kubectl -- apply -f ${KUBE_FILES_PATH}/frontend-deployment.yaml
                        minikube kubectl -- apply -f ${KUBE_FILES_PATH}/frontend-service.yaml
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "Vérification de l'état des pods..."
                    def podStatus = sh(
                        script: 'minikube kubectl -- get pods -l app=frontend -o jsonpath="{.items[*].status.phase}"',
                        returnStdout: true
                    ).trim()

                    if (!podStatus.contains("Running")) {
                        error "Les pods ne sont pas en état 'Running'. État actuel : ${podStatus}"
                    }

                    echo "Vérification des services Kubernetes..."
                    sh "minikube kubectl -- get service frontend"

                    def minikubeIP = sh(script: 'minikube ip', returnStdout: true).trim()
                    def nodePort = sh(
                        script: 'minikube kubectl -- get service frontend -o jsonpath="{.spec.ports[0].nodePort}"',
                        returnStdout: true
                    ).trim()

                    echo "==================================="
                    echo "Déploiement accessible sur : http://${minikubeIP}:${nodePort}"
                    echo "==================================="
                }
            }
        }
    }

    post {
        success {
            echo "Déploiement réussi."
        }
        failure {
            echo "Le déploiement a échoué. Vérifiez les logs pour plus de détails."
        }
        always {
            echo "Nettoyage des fichiers temporaires..."
            cleanWs()
        }
    }
}
