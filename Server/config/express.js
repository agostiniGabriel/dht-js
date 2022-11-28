const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const consign = require('consign');
const dhtKv = require('dht-keyvalue')

const dhtOpts = {
    keep: true, 
    keepalive: 3600000 
}

module.exports = () => {
    const serverApp = express();
    const contentMap = new Map();
    const dkv = new dhtKv(dhtOpts);

    //Settings
    serverApp.set('port', process.env.PORT || config.get('server.port'));
    
    //Middlewares
    serverApp.use(bodyParser.json());
    serverApp.use(cors());

    //Local map
    serverApp.contentMap = contentMap;
    serverApp.getContent = () => {
        return [...serverApp.contentMap.values()];
    }
    serverApp.setContent = (key,value) => {
        serverApp.contentMap.set(key,value);
    }
    serverApp.getContentByKey = (key) =>{
        return serverApp.contentMap.get(key);
    }
    serverApp.dkvReference = dkv;

    //Endpoints
    consign({cwd: 'api'})
        .then('data')
        .then('controllers')
        .then('routes')
        .into(serverApp)

    return serverApp;
}
