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
            if(!artistId){
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

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
}