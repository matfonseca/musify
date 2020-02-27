'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../model/artist');
var Album = require('../model/album');
var Song = require('../model/song');
var mongoosePagination = require('mongoose-pagination');

function getSong(req,res){
    var songId = req.params.id;
    
    Song.findById(songId, (err,song) => {
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!song){
                res.status(404).send({message:"La cancion no existe"});
            }else{
                res.status(200).send({song});
            }
        }
    })
}

function getSongs(req,res){
    var albumId = req.params.album;
    
    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album:albumId}).sort('number');
    }

    find.populate({
        path:'album',
        populate:{
            path:'artist',
            model:'Artist'
        }
    }).exec(function(err,song){
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            res.status(200).send({song});
        }
    } );
}
function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err,songUpdate) => {
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!songUpdate){
                res.status(404).send({message:"La cancion no ha sido actualizado"});
            }else{
                res.status(200).send({
                song:songUpdate    
                });
            }
        }
    });
}

function saveSong(req,res){
    var song = new Song();
    
    var param = req.body;
    song.number = param.number;
    song.name = param.name;
    song.duration = param.duration;
    song.file = "null";
    song.album = param.album;

    song.save((err,songStored) => {
        if(err){
            res.status(500).send({message:"Error al guardar la cancion"});
        }else{
            if(!songStored){
                res.status(404).send({message:"La cancion no ha sido guardado"});
            }else{
                res.status(200).send({song:songStored});
            }
        }

    })
}
function deleteSong(req,res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            return res.status(500).send({message:"Error al eliminar la cancion"});
        }else{
            if(!songRemoved){
                return res.status(404).send({message:"La cancion no ha sido eliminado"});
            }else{
                return res.status(200).send({song:songRemoved}); 
            }
        }
    });
}


function uploadFile(req,res){
    var songId = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[file_split.length - 1];
        var file_ext = file_name.split('.')[1].toLowerCase();
        
        if(file_ext == 'mp3' || file_ext == 'ogg' ){

            Song.findByIdAndUpdate(songId, {file:file_name}, (err,songUpdated) => {
                if(err){
                    res.status(500).send({message:'Error al actualizar la cancion'});
                }else{
                    if(!songUpdated){
                        res.status(404).send({message:'No se puedo actualizar la cancion'});
                    }else{
                        res.status(200).send({song:songUpdated});
                    }
                }

            });

        }else{
            res.status(200).send({message:'Extension del archivo invalida'});
        }

        console.log(file_path);
        console.log(file_split[file_split.length - 1]);

    }else{
        res.status(200).send({message:'No ha subido ninguna cancion'});
    }
}
function getFile(req,res){
    var file = req.params.file;
    var pathFile = './uploads/songs/'+file;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message:'No existe el fichero de la cancion...'})
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile,
}