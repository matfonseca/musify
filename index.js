'use strict'

var mongoose = require('mongoose');
var app = require('./app'); //fichera de carga central
var port = process.env.PORT || 3977; //process es porq si tenemos un env
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/musify', { useNewUrlParser: true,useUnifiedTopology: true  }, (err,res) => {
    if(err){
        throw err;
    }else{
        console.log('La base de datos esta corriendo correctamente...')
        
        app.listen(port,function(){
            console.log('servidor del api rest escuchando http://localhost:'+port);
        })
    }
})