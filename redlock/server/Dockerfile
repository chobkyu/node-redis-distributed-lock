# Nodejs image
FROM node:18

# Working directory
WORKDIR /.

COPY package.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]