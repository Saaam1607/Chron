require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")
const gestoreEmail = require("../components/gestoreEmail/gestoreEmail");

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');

