FROM node:8.11

RUN apt-get update && apt-get install -y libaio1 unzip

RUN mkdir -p /usr/src/staff-fee-privilege-api /opt/oracle

WORKDIR /usr/src/staff-fee-privilege-api
COPY . /usr/src/staff-fee-privilege-api

RUN npm install -g gulp && npm install
RUN unzip bin/instantclient-basiclite-linux.x64-12.2.0.1.0.zip -d /opt/oracle

RUN cd /opt/oracle/instantclient_12_2 \
 && ln -s libclntsh.so.12.1 libclntsh.so \
 && ln -s libocci.so.12.1 libocci.so

RUN echo /opt/oracle/instantclient_12_2 > /etc/ld.so.conf.d/oracle-instantclient.conf \
 && ldconfig

CMD ["gulp", "test"]
