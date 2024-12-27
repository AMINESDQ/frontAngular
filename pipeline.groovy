pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        KUBE_FILES_PATH = 'kubernetes'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy Frontend') {
            when {
                changeset "**/frontend/**"
            }
            steps {
                dir('frontend') {
                    script {
                        // Build et push de l'image Docker
                        docker.build("sadiqmohamedamine/sadiqfront:${BUILD_NUMBER}")
                        sh "echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin"
                        sh "docker push sadiqmohamedamine/sadiqfront:${BUILD_NUMBER}"
                        
                        // Mise à jour du numéro de version dans le fichier de déploiement
                        sh """
                            sed -i 's|sadiqmohamedamine/sadiqfront:.*|sadiqmohamedamine/sadiqfront:${BUILD_NUMBER}|' \
                            ../${KUBE_FILES_PATH}/frontend-deployment.yaml
                        """
                        
                        // Déploiement avec minikube kubectl
                        sh """
                            minikube kubectl -- apply -f ../${KUBE_FILES_PATH}/frontend-deployment.yaml
                            minikube kubectl -- apply -f ../${KUBE_FILES_PATH}/frontend-service.yaml
                        """

                        // Attendre que le déploiement soit prêt
                        sh "minikube kubectl -- rollout status deployment/frontend"
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                        echo "Vérification du déploiement frontend..."
                        minikube kubectl -- get pods -l app=frontend
                        minikube kubectl -- get service frontend
                        
                        echo "URL d'accès à l'application :"
                        minikube kubectl -- get service frontend
                        
                        # Obtenir l'IP de Minikube
                        echo "Minikube IP: \$(minikube ip)"
                    """

                    // Vérifier l'état des pods
                    def podStatus = sh(
                        script: 'minikube kubectl -- get pods -l app=frontend -o jsonpath="{.items[*].status.phase}"',
                        returnStdout: true
                    ).trim()

                    if (!podStatus.contains("Running")) {
                        error "Les pods ne sont pas en état 'Running'. État actuel: ${podStatus}"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                // Obtenir l'IP de Minikube
                def minikubeIP = sh(
                    script: 'minikube ip',
                    returnStdout: true
                ).trim()

                // Obtenir le port du service
                def nodePort = sh(
                    script: 'minikube kubectl -- get service frontend -o jsonpath="{.spec.ports[0].nodePort}"',
                    returnStdout: true
                ).trim()

                echo "==================================="
                echo "Déploiement terminé avec succès!"
                echo "Accédez à l'application sur: http://${minikubeIP}:${nodePort}"
                echo "==================================="
            }
        }
        failure {
            echo "Le déploiement a échoué. Vérifiez les logs pour plus de détails."
        }
        always {
            cleanWs()
        }
    }
}