FROM node:14-bullseye-slim

ARG CDR=/var/local/test
ENV CHECKOUT=$CDR
WORKDIR $CHECKOUT

COPY . $CHECKOUT

RUN yarn install --frozen-lockfile \
  && yarn cache clean