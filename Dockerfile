FROM node:23-alpine

WORKDIR /opt

COPY package.json .
COPY package-lock.json .

RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "server:prod"]
