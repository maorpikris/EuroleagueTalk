FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=/api
ARG VITE_SERVER_URL=/
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

EXPOSE 5173

# Run vite host to allow external connections
CMD ["npm", "run", "dev", "--", "--host"]
