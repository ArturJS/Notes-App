FROM node:8.10.0-slim

WORKDIR /usr/node/notes-app_ui-service
RUN apt-get update && apt-get install -y openssl curl sudo && \
  echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  chown -R node:node . /home/node/
USER node

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
RUN npm install

COPY --chown=node:node ./ ./
RUN npm run build

ENTRYPOINT ["node", "server/index.js"]
