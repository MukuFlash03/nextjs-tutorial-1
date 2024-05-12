FROM node:20.13.0

WORKDIR /app/backend

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 5550

CMD ["npm", "run", "dev"]
