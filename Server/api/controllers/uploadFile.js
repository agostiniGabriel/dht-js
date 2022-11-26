module.exports = app =>{
    const controller = {};
    const axios = require('axios');

    controller.uploadFile = (req,res) => {
        console.log(JSON.parse(JSON.stringify(req)));
        res.status(200).json({"success":true});
    }

    controller.getFileList = (req,res) =>{
        res.status(200).json({fileList:app.getContent()});
    }

    return controller;
}