FROM node:20

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

EXPOSE 3001

CMD ["/bin/ash", "-c", "npm i && npm run dev"]
