FROM node:8.16.0-slim

WORKDIR /usr/node/notes-app_ui-service
RUN apt-get update && \
  apt-get install -y \
  openssl \
  curl \
  sudo \
  libcap2-bin && \
  echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  chown -R node:node . /home/node/
RUN setcap 'cap_net_bind_service=+ep' $(whereis node | awk '{print $2}') # access to 80 port
USER node

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
RUN npm install

COPY --chown=node:node ./ ./
RUN npm run build

ENTRYPOINT ["node", "server/index.js"]
