FROM node:8.10.0-slim

WORKDIR /usr/node/notes-app
RUN apt-get update && apt-get install -y openssl curl sudo && \
  mkdir -p /home/node/.preact-cli /home/node/.config/devcert && \
  echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  chown -R node:node . /home/node/
USER node

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
COPY --chown=node:node ./ ./

RUN npm install --production && \
    npm run build:docker

ENTRYPOINT ["node", "server/index.js"]
