#! /bin/sh

if [ -z $ES_BIN_PLUGIN ]; then
   ES_BIN_PLUGIN="plugin"
fi

if [ -z $ES_RIVER_VERSION ]; then
   ES_RIVER_VERSION="2.0.9"
fi

if [ -z $ES_MAPPER_VERSION ]; then
   ES_MAPPER_VERSION="2.7.1"
fi

# How to setup the elasticsearch+kibana
# download elasticsearch and install it
# download kibana and run it (http://localhost:5601)

# wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.3.tar.gz
# wget https://download.elastic.co/kibana/kibana/kibana-4.1.2-darwin-x64.zip


# install the monitoring tool for es cluster
$ES_BIN_PLUGIN -install karmi/elasticsearch-paramedic
#$ES_BIN_PLUGIN --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/$ES_RIVER_VERSION
$ES_BIN_PLUGIN --install elasticsearch/elasticsearch-mapper-attachments/$ES_MAPPER_VERSION
# used to convert geojson of mongo to geopoint of es
$ES_BIN_PLUGIN --install elasticsearch/elasticsearch-lang-javascript/2.4.1
$ES_BIN_PLUGIN -install elasticsearch/elasticsearch-lang-groovy/2.0.0