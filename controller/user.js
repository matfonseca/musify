'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../model/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'probando una accion del controlador de usuarios del api rest con node y mongo'
    });
}

function saveUser(req, res){
    var user = new User();

    //tomar los parametros del post
    var params = req.body;

    console.log(params);
    //seteo los datos en el usuarioa guardar
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    //guardo en la base de datos
    if(params.password){
        //encriptar contraceña y guarda datos
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                //guardo el usuario
                user.save((err,userStored) => {
                    if(err){
                        res.status(500).send({message:'error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message:'No se ha registrado el usuario'});

                        }else{
                            res.status(200).send({user:userStored});
                        }
                    }
                });
            }else{
                //error por falta de campo
                res.status(200).send({message: 'introduce todos los campos'});        
            }
        })
    }else{
        //lanzo un error
        res.status(500).send({message: 'introduce la contraceña'});
    }
}

function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    //busco en la base de datos si existe el mail
    User.findOne({email:email.toLowerCase()}, (err,user) => {
        if(err){
            res.status(500).send({message:'error en la peticion'});
        }else{
            if(!user){
                res.status(404).send({message:'el usuario no existe'});
            }else{
                //Comprobar la contraseña
                bcrypt.compare(password,user.password, function(err,check){
                    if(check){
                        if(params.gethash){
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:'contraseña incorrect'});
                    }
                })
            }
        }
    })
}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err,userUpdated) => {
        if(err){
            res.status(500).send({message:'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message:'No se puedo actualizar el usuario'});
            }else{
                res.status(200).send({user:userUpdated});
            }
        }
    });
}

function uploadImage(req,res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[file_split.length - 1];
        var file_ext = file_name.split('.')[1].toLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image:file_name}, (err,userUpdated) => {
                if(err){
                    res.status(500).send({message:'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message:'No se puedo actualizar el usuario'});
                    }else{
                        res.status(200).send({user:userUpdated, image: file_name});
                    }
                }

            });

        }else{
            res.status(200).send({message:'Extension del archivo invalida'});
        }

        console.log(file_path);
        console.log(file_split[file_split.length - 1]);

    }else{
        res.status(200).send({message:'No ha subido ninguna imagen'});
    }
}

function getImage(req,res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/'+imageFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message:'No existe la imagen...'})
        }
    });
}
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImage
};