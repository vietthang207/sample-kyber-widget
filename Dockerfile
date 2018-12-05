FROM node:10 as build-env
COPY . /sample-kyber-widget/
WORKDIR /sample-kyber-widget
RUN npm install

FROM node:10-slim
COPY --from=build-env /sample-kyber-widget /sample-kyber-widget
WORKDIR /sample-kyber-widget
EXPOSE 8080
CMD ["npm", "run", "start"]
