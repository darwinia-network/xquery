FROM node:16-alpine 

COPY . /xquery

RUN npm i -g ts-node

ENTRYPOINT ["ts-node", "/xquery/packages/node/dist/main.js"]

CMD [ "--port", "6000" ]
