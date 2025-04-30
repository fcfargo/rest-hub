FROM node:20-alpine

RUN apk add --no-cache tzdata
ENV TZ="Asia/Seoul"

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn remove bcrypt
RUN yarn add bcrypt
RUN yarn build

ENV HOST 0.0.0.0
EXPOSE 8000

CMD ["yarn", "start:production"]