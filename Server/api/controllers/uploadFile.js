const DHT_CATALOGUE = "./dht-catalogue";
const CHUNCK_SIZE = 10000000;
const fs = require('fs');
const crypto = require('crypto');

module.exports = app =>{
    const controller = {};
    
    controller.uploadFile = (req,res) => {
        const { fileName } = req.query;
        app.setContent(fileName,[]);
        let count = 0;
        req.on('readable', function(){  
            const buffer = req.read();
            if(buffer){
                const parts = divulgateContent(fileName, buffer, app.dkvReference,++count);
                app.setContent(fileName, [...app.getContentByKey(fileName),...parts]);
            }
        });
        res.status(200).json({success:true});
    }

    controller.getFileList = (_req,res) =>{
        res.status(200).json({fileList:app.getContent()});
    }

    controller.downloadFile = (req,res) =>{
        const { fileName } = req.query;
        const parts = app.getContentByKey(fileName);
        console.time("Download");
       
        if(!parts){
            res.status(404).json({success:false,msg:"File not found"});
            return;
        }
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileName}"`
        });
        res.status(200);
        
        parts.forEach(part => {
            console.log(`Retrieving part ${part.key}`);
            app.dkvReference.get(part.key,(err,value)=>{
                if(err) console.log(err);
                res.write(fs.readFileSync(value));
            });
        });
       
        res.end();
        console.timeStamp("Download end");
    }

    return controller;
}

function divulgateContent(fileName,buffer,dhtReference,count){
    const now = new Date();
    const parts = [];
    for(let start = 0; start<buffer.length ; start += CHUNCK_SIZE){
        const data = buffer.slice(start,start+CHUNCK_SIZE);
        const partId = crypto.createHash('md5').update(fileName + now + start + count).digest('hex').toString();
        const savePath = `${DHT_CATALOGUE}/${partId}`;
        let partWrapper = {
            key:partId,
            value:savePath
        };
        fs.writeFileSync(savePath,data);
        parts.push(partWrapper);
    }
    dhtReference.put([...parts],(err, hash, key)=>{
        if(err) console.log(err);
        console.log(`Successfully announced: ${key}, DHT address: ${hash}`)
    });
    return parts;
}