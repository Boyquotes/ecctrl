FROM --platform=linux/amd64 node:22

RUN apt update
RUN apt install -y xdg-utils
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
