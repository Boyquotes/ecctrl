FROM --platform=linux/amd64 node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

EXPOSE 3001

CMD ["tail", "-f", "/dev/null"]
