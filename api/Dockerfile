# pull base image
FROM python:3.8.1-slim-buster

# set work dir

WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# install network & python dependencies
RUN apt-get update && apt-get install -y software-properties-common\
	wget \
	netcat \
	apt-utils curl \
	python3 python3-pip python3-setuptools
# install obdc dependencies
RUN apt-get install -y unixodbc-dev g++
RUN pip3 install --upgrade pip
COPY ./api/requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# install Microsoft SQL
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add - 
RUN add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/18.04/mssql-server-2019.list)"
RUN curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update
RUN ACCEPT_EULA=Y apt-get install -y mssql-server msodbcsql17 mssql-tools

# copy the flask services and data models
COPY api /usr/src/app/api
COPY console.py /usr/src/app/console.py
COPY models /usr/src/app/models

# run entrypoint
ENTRYPOINT ["/usr/src/app/api/entrypoint.sh"]