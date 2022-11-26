const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const consign = require('consign');

module.exports = () => {
    const serverApp = express();
    const contentMap = new Map();

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

    //Endpoints
    consign({cwd: 'api'})
        .then('data')
        .then('controllers')
        .then('routes')
        .into(serverApp)

    return serverApp;
}
