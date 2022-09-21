FROM node:16-alpine 

COPY packages/node /xquery

RUN npm i -g ts-node

ENTRYPOINT ["ts-node", "/xquery/dist/main.js"]

CMD [ "--port", "6000" ]
