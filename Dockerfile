FROM node:18.12.1
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
CMD yarn start-prod