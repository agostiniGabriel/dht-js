const serverApp = require('./config/express')();
const port = serverApp.get('port');

serverApp.listen(port, ()=>{
    console.log('Tudo certo por aqui 😁');
})