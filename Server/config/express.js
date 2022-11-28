const express = require('express');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const consign = require('consign');
const http2 = require('http2')

module.exports = () => {
    const serverApp = express();
    const contentMap = new Map();

    //Settings
    serverApp.set('port', process.env.PORT || config.get('server.port'));
    
    //Middlewares
    serverApp.use(bodyParser.json());
    serverApp.use(express.urlencoded({extended: true}))
    serverApp.use(fileUpload())
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

    // return {'http2Wrapper' : http2.createServer(serverApp), 'express':serverApp };
    return serverApp;
}
