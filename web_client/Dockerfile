# pull from node
FROM node:10.22.1-buster-slim

# set working directory
WORKDIR /usr/src/app

# Copy the resources to container
COPY web_client /usr/src/app/web_client
COPY web_client/entrypoint.sh /usr/src/app/entrypoint.sh

# run the entrypoint
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
