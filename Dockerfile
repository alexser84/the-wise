# Establecer la imagen base
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Copiar el archivo .env
# COPY .env .env

# Exponer el puerto especificado en el archivo .env
EXPOSE ${PORT}

# Comando para iniciar la aplicación
CMD ["node", "app.js"]
