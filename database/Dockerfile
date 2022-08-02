FROM mongo
COPY base.json /base.json
CMD mongoimport --host blue_coding_mongo --db blue_coding --collection blue_coding --drop --file ./base.json