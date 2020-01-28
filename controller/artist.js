'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../model/artist');
var Album = require('../model/album');
var Song = require('../model/song');

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
    saveArtist
}