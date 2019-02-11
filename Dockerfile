FROM node:10.5.0
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node
COPY . .
RUN npm install --production
USER node
EXPOSE 7000
COPY --chown=node:node . .
CMD [ "npm", "start" ]