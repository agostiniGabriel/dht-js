const DHT_CATALOGUE = "./dht-catalogue";
const CHUNCK_SIZE = 1024*1024*2;
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
            console.log(buffer);
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
        console.log(parts);
        let data =[];
       
        if(!parts){
            res.status(404).json({success:false,msg:"File not found"});
            return;
        }
        
        parts.forEach(part => {
            console.log(`Retrieving part ${part.key}`);
            data.push(fs.readFileSync(part.value));
        });
        const buff = Buffer.concat(data);
        res.status(200);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Length': buff.length,
            'Content-Disposition': `attachment; filename="${fileName}"`
        });
        res.send(buff);
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
        console.log(`Successfully announced: ${key}, DHT address: ${hash}`)
    });
    return parts;
}