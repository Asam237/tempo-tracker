FROM node:12.22.9-buster-slim
RUN mkdir /app
RUN chmod 777 /app

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install
ENV HOST 0.0.0.0
EXPOSE 3001
CMD ["yarn", "dev"]
