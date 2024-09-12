FROM node:latest

WORKDIR /app

COPY public /app
COPY package-lock.json /app
COPY package.json /app
COPY eslint.config.js /app
COPY index.html /app
COPY postcss.config.js /app
COPY tailwind.config.js /app
COPY vite.config.js /app

RUN npm install

RUN mkdir /app/src
COPY src/assets /app/src/assets
COPY src/components /app/src/components
COPY src/App.jsx /app/src
COPY src/index.css /app/src
COPY src/main.jsx /app/src


EXPOSE 5173

CMD ["npm", "run", "dev"]