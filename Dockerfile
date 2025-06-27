# Etapa de build
FROM node:20-alpine3.21

# Define diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos necessários
COPY package*.json ./
# COPY tsconfig.json ./
RUN npm install

# Copia o restante
COPY . .

# Expõe porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
