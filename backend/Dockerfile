FROM node:20.13.0

WORKDIR /app/backend

COPY ./package*.json ./

RUN npm install

COPY . .

# Placeholder for backend server port; actual port is set and overridden by .env file.
EXPOSE 5000

CMD ["npm", "run", "dev"]
