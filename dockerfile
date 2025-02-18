
FROM node:18-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


# Define the command to run the app
CMD ["npm", "serve"]