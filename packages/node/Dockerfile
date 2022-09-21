FROM node:16-alpine 

COPY packages/node/dist /xquery

RUN npm i -g ts-node

ENTRYPOINT ["ts-node", "/xquery/main"]

CMD [ "--port", "6000" ]
