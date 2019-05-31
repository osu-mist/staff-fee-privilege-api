FROM python:3

WORKDIR /usr/src/app

COPY tests/integration .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
USER nobody:nogroup
ENTRYPOINT ["python3"]
CMD ["integrationtests.py", "-v", "-i", "configuration.json"]
