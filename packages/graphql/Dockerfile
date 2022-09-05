FROM node:16-alpine

COPY . /opt/app

RUN cd /opt/app && yarn install && yarn build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}



WORKDIR /opt/app

ENTRYPOINT ["npm", "run", "start:prod"]

CMD [ "--port", "5004" ]
