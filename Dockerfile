FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm install --save-dev nodemon

EXPOSE 3000

CMD ["npx", "nodemon", "app.js"]