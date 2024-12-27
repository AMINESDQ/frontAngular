FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

# La modification clé est ici - permettre l'accès depuis n'importe quelle IP
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]