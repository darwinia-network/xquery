FROM node:16 as builder 

ARG RELEASE_VERSION=latest 

RUN npm i -g @darwinia/xquery-node@${RELEASE_VERSION}   

FROM node:16-alpine 

COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN npm i -g ts-node

ENTRYPOINT ["ts-node", "/usr/local/lib/node_modules/@darwinia/xquery-node/main"]

CMD [ "--port", "6000" ]
