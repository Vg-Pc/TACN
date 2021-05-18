FROM node:10-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn
COPY . .
RUN yarn build

# THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# Launch the wait tool and then your application
# CMD yarn start

