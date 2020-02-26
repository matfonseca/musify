'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../model/artist');
var Album = require('../model/album');
var Song = require('../model/song');
var mongoosePagination = require('mongoose-pagination');

function getArtist(req,res){
    var artistId = req.params.id;
    console.log(artistId);
    Artist.findById(artistId, (err,artist) => {
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!artist){
                res.status(404).send({message:"El artista no existe"});
            }else{
                res.status(200).send({artist});
            }
        }
    })
}

function getArtists(req,res){
    if(req.params.page){
        var page = req.params.page;    
    }else{
        var page = 1; //valor default
    }
    
    var itemsperpage = 3;

    Artist.find().sort('name').paginate(page, itemsperpage, function(err,artists,total){
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!artists){
                res.status(404).send({message:"No hay artistas"});
            }else{
                return res.status(200).send({
                    total_items:total,
                    artists: artists
                });
            }
        }
    } );

}
function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err,artistUpdate) => {
        if(err){
            res.status(500).send({message:"Error en la petision"});
        }else{
            if(!artistUpdate){
                res.status(404).send({message:"El artista no ha sido actualizado"});
            }else{
                res.status(200).send({
                artist:artistUpdate    
                });
            }
        }
    });
}

function saveArtist(req,res){
    var artist = new Artist();
    
    var param = req.body;
    artist.name = param.name;
    artist.description = param.description;
    artist.image = "null";

    artist.save((err,artistStored) => {
        if(err){
            res.status(500).send({message:"Error al guardar el artista"});
        }else{
            if(!artistStored){
                res.status(404).send({message:"El artista no ha sido guardado"});
            }else{
                res.status(200).send({artist:artistStored});
            }
        }

    })
}
function deleteArtist(req,res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            return res.status(500).send({message:"Error al eliminar el artista"});
        }else{
            if(!artistRemoved){
                return res.status(404).send({message:"El artista no ha sido eliminado"});
            }else{
                
                Album.deleteMany({artistID: artistRemoved._id},(err,albumRemoved) =>{
                    if(err){
                        return res.status(500).send({message:"Error al eliminar el Album"});
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
                                        return res.status(200).send({artist:artistRemoved});
                                    }
                                }
                            });    
                         }
                    }   
                } );
            }
        }
    });
}

function uploadImage(req,res){
    var artistID = req.params.id;
    var file_name = "No subido...";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[file_split.length - 1];
        var file_ext = file_name.split('.')[1].toLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Artist.findByIdAndUpdate(artistID, {image:file_name}, (err,artistUpdated) => {
                if(err){
                    res.status(500).send({message:'Error al actualizar el artista'});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message:'No se puedo actualizar el artista'});
                    }else{
                        res.status(200).send({artist:artistUpdated});
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
    var pathFile = './uploads/artists/'+imageFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message:'No existe la imagen...'})
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImage,
}