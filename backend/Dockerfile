FROM node:lts
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install axios
RUN npm audit fix
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
