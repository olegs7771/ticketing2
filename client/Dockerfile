# initial image 
FROM node:alpine
# set working derectory 
WORKDIR /app 

# cope over package.json file into working derectory
COPY package.json .
# run npm install 
RUN npm install
#  copy everything rest to the client derectory 
COPY . . 

# command after image was buid 
CMD ["npm","run","dev" ]