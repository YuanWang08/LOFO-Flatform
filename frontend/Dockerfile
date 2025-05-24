FROM node:20

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY nuxt.config.ts .
COPY tailwind.config.js .
COPY tsconfig.json .

RUN npm run build

EXPOSE 3000
EXPOSE 24678

CMD ["/bin/ash", "-c", "npm i && npm run dev"]
