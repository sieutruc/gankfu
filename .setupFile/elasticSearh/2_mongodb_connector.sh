#! /bin/sh

if [ -z $ES_HOST ]; then
   ES_HOST="localhost"
fi
if [ -z $ES_PORT ]; then
   ES_PORT="9200"
fi

mkdir mongo && cd mongo

virtualenv envTest
# activate python newly created evn
. envTest/bin/activate

# checkout our version of mongodb-connector
git clone https://github.com/sieutruc/mongo-connector.git
cd mongo-connector
git checkout include_field_set

# install mongodb-connector in develop mode
python setup.py develop
cd ..

#mongo-connector -c ../testgank/.setupFile/elasticSearh/mongo-conf.json
