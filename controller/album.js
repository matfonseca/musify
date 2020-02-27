'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../model/artist');
var Album = require('../model/album');
var Song = require('../model/song');
var mongoosePagination = require('mongoose-pagination');

function getAlbum(req,res){
    var albumId = req.params.id;
    
    Album.findById(albumId, (err,album) => {
        if(err){
            res.status(500).send({message:"Error en la peticion"});
        }else{
            if(!album){
                res.status(404).send({message:"El album no existe"});
            }else{
                res.status(200).send({album});
            }
        }
    })
}
function saveAlbum(req,res){
    var album = new Album();
    
    var param = req.body;
    album.title = param.title;
    album.description = param.description;
    album.year = param.year;
    album.image = "null";
    album.artist = param.artist;


    album.save((err,albumStored) => {
        if(err){
            res.status(500).send({message:"Error al guardar el album"});
        }else{
            if(!albumStored){
                res.status(404).send({message:"El album no ha sido guardado"});
            }else{
                res.status(200).send({artist:albumStored});
            }
        }

    })
}
function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err,albumUpdate) => {
        if(err){
            res.status(500).send({message:"Error en la peticion"});
        }else{
            if(!albumUpdate){
                res.status(404).send({message:"El album no ha sido actualizado"});
            }else{
                res.status(200).send({
                album:albumUpdate
                });
            }
        }
    });
}

function uploadImage(req,res){
    var albumID = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[file_split.length - 1];
        var file_ext = file_name.split('.')[1].toLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Album.findByIdAndUpdate(albumID, {image:file_name}, (err,albumUpdated) => {
                if(err){
                    res.status(500).send({message:'Error al actualizar el artista'});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message:'No se puedo actualizar el artista'});
                    }else{
                        res.status(200).send({artist:albumUpdated, image : file_name});
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
    var pathFile = './uploads/albums/'+imageFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message:'No existe la imagen...'})
        }
    });
}

function deleteAlbum(req,res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            return res.status(500).send({message:"Error al eliminar el album"});
        }else{
            if(!albumRemoved){
                return res.status(404).send({message:"El album no ha sido eliminado"});
            }else{    
                Song.deleteMany({album: albumRemoved._id},(err,songRemoved) =>{
                    if(err){
                        return res.status(500).send({message:"Error al eliminar el Song"});
                    }else{
                        if(!songRemoved){
                            return res.status(404).send({message:"El Song no ha sido eliminado"});
                        }else{
                            return res.status(200).send({artist:albumRemoved});
                        }
                    }
                });    
            }
        }   
    } );
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImage
}