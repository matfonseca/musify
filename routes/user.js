'use strict'

var express = require('express');
var userController = require('../controller/user');

var api = express.Router();

api.get('/probando-controlador', userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
module.exports = api;