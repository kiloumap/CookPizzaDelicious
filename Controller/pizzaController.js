'use strict';
/**
 * Controller Pizza
 * @requires Model
 */

const Pizza = require('../Model/pizzaSchema');
const express = require('express');
const router = express.Router();
const ServerEvent = require('./ServerEvent');
// -------------------------------------------------------------------------- //
//                                Routes                                      //
// -------------------------------------------------------------------------- //
router.post('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    postPizza(req, res, next);
});

router.get('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    getAllPizza(req, res, next);
});

router.get('/:name', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    getPizzaByName(req, res, next);
});

router.get('/sort/:price', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    getPizzaByPrice(req, res, next);   
});

router.delete('/:name', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    deletePizza(req, res, next);
});

router.put('/:name', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    updatePizza(req, res, next);
})

// -------------------------------------------------------------------------- //
//                              Functions                                     //
// -------------------------------------------------------------------------- //
/**
 * @function postPizza
 * @param {function} req - a json containing the pizza body 
 * @description POST pizza, picture property must be in utf-8
 * @return {json} res - Pizza
 */
function postPizza(req, res) {
    // Convert image to base64
     req.body.picture = encodeBase64(req.body.picture);
     
    //Creates a new pizza
    const newPizza = new Pizza(req.body);
    
    //Save it into the DB.
    newPizza.save((err, savedPizza) => {
        if (err) {
            res.status(500);
            res.json({ message: err });
        }
        else { //If no errors, send it back to the client
            ServerEvent.emit('PizzaSaved', savedPizza);
            res.status(200).end();
        }
    });
}

/**
 * @function getAllPizza
 * @description GET ALL pizzas, picture property is decode to utf-8
 * @return {json} res - All the pizzas
 */
function getAllPizza(req, res) {
    Pizza.find({}, null, { sort: { update_at: -1 } })
    .populate('ingredient_ids')
    .exec((err, pizzas) => {
        if (err) {
            res.status(500);
            res.json({ message: err });
        }
        else {
            // Decode base64 image
            for(let i = 0, len = pizzas.length; i < len; i++){
                pizzas[i].picture = decodeBase64(pizzas[i].picture)
            }
            res.status(200).json(pizzas);
        }
    });
}

/**
 * @function getPizzaByName
 * @param {function} req - a string containing the name of pizza to search
 * @description GET pizza with name only
 * @return {json} res - Pizza
 */
function getPizzaByName(req, res){
    console.log(req.params.name);
    Pizza.findOne({name : req.params.name}, (err, pizza) =>{
        if(err){
          res.send(err);
        } else { //If no error, send pizza
            console.log(pizza);
            pizza.picture = decodeBase64(pizza.picture);
            res.json(pizza);
        }
    })
}
getPizzaByPrice

/**
 * @function getPizzaByPrice
 * @param {function} req - a Number containing the price of pizzas to search
 * @description GET pizza with price only
 * @return {json} res : Pizzas at this price
 */
function getPizzaByPrice(req, res){
    console.log(req.params.name);
    Pizza.find({price : req.params.price}, (err, pizzas) =>{
        if(err){
          res.send(err);
        } else { //If no error, send pizza
             // Decode base64 image
            for(let i = 0, len = pizzas.length; i < len; i++){
                pizzas[i].picture = decodeBase64(pizzas[i].picture)
            }
            res.json(pizzas);
        }
    }).sort( { price : -1})
}

/**
 * @function deletePizza
 * @param {function} req - A name containing the pizza to delete
 * @description DELETE pizza with this name
 * @return {json} res - Pizza deleted
 */
function deletePizza(req, res){
    Pizza.findOneAndRemove({name : req.params.name},  function (err, pizza){
        if(err){
            res.send(err);
        } else {
            if(pizza != null){
                res.json({ message: "Pizza successfully deleted!", pizza });
            } else {
                res.json({ message: "Pizza was deleted already" })
            }
        }
    })
}

/**
 * @function updatePizza
 * @param {function} req - request
 * @param {function} res - result
 * @description PUT pizza, picture property must be in utf-8
 * @return {json} Pizza
 */
function updatePizza(req, res) {
     Pizza.findOneAndUpdate({name : req.params.name}, req.body, {new: true}, function (err, pizza) {
        if (err) {
            res.send(err);
        } else {
            // res.status(200).send(pizza);
            res.json({message: "Pizza successfully updated!", pizza });
        }
    });
}

/**
 * @function decodeBase64
 * @params(string) base64 to decode
 * @return {string} in utf-8
 */
function decodeBase64(base64){
  return new Buffer.from(base64, 'base64');
}

/**
 * @function encodeBase64
 * @params(string) image to encode
 * @return {string} in base64
 */
function encodeBase64(image){
  return new Buffer.from(image);
}

// -------------------------------------------------------------------------- //
//                                Events                                      //
// -------------------------------------------------------------------------- //
console.log('pizzaEvent is Ready !!!');
ServerEvent.on('myEvent', (data, socket) => {
  console.log('This is myEvent call');
  ServerEvent.emit('myEventDone', data, socket);
});

module.exports = router;