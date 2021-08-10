FROM node:16-alpine as build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install

COPY src/ src/


RUN yarn build

FROM node:16-alpine as production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY --from=build /app/build/ build/

CMD yarn prod
