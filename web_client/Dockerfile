# pull from node
FROM node:14.11.0-stretch

# set working directory
WORKDIR /usr/src/app

# Copy the resources to container
COPY web_client /usr/src/app/web_client
COPY web_client/entrypoint.sh /usr/src/app/entrypoint.sh

# run the entrypoint
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
