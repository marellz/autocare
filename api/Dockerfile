FROM node:20.19

ARG API_PORT=8000
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${API_PORT}

CMD ["npm", "run", "dev"]
