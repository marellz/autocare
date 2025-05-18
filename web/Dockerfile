# Base Image
FROM node:20.19

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN chmod +x node_modules -f
RUN chown node:node node_modules -f

EXPOSE 5173
EXPOSE 24678


CMD [ "npm", "run", "dev", "--","--host" ]

