FROM node:alpine

WORKDIR /app 

COPY package.json .
# prevent from dowloding dev dependencie whenever we rebuild image 
RUN npm install --only=prod

COPY . .
CMD ["npm","start"]