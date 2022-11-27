module.exports = app =>{
    const controller = {};
    const fs = require('fs');

    controller.uploadFile = (req,res) => {
        req.on('readable', function(){
            const buffer = req.read();
            if(buffer){
                app.setContent(req.query.fileName,req.query.fileName);
                fs.writeFileSync(req.query.fileName, buffer);
            }
        });
        res.status(200).json({"success":true});
    }

    controller.getFileList = (req,res) =>{
        res.status(200).json({fileList:app.getContent()});
    }

    return controller;
}