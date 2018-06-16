FROM ibmcom/ibmnode:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install

# Same PORT defined at src/env/index.js
EXPOSE 2000

COPY src /usr/src/app/src/
COPY public /usr/src/app/public/

CMD ["node", "src/server.js"]
