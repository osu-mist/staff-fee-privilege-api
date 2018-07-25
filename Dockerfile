FROM node:8.11

RUN apt-get update && apt-get install -y libaio1 unzip

RUN mkdir -p /usr/src/staff-fee-privilege-api /opt/oracle

WORKDIR /usr/src/staff-fee-privilege-api
COPY . /usr/src/staff-fee-privilege-api

RUN npm install
RUN npm install -g gulp
RUN unzip bin/instantclient-basiclite-linux.x64-12.2.0.1.0.zip -d /opt/oracle \
 && mv /opt/oracle/instantclient_12_2 /opt/oracle/instantclient

RUN cd /opt/oracle/instantclient \
 && ln -s libclntsh.so.12.1 libclntsh.so \
 && ln -s libocci.so.12.1 libocci.so

RUN echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf \
 && ldconfig

USER nobody:nogroup
CMD ["gulp", "test"]
