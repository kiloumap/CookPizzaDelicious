'use strict';
// -------------------------------------------------------------------------- //
//                              Recuperation                                  //
// -------------------------------------------------------------------------- //
const Pizza = require('../Model/pizzaSchema');
const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------- //
//                                Routes                                      //
// -------------------------------------------------------------------------- //

router.post('/', (req, res, next) => {
    postPizza(req, res, next);
});

router.get('/', (req, res, next) => {
    getAllPizza(req, res, next);
});

router.get('/:name', (req, res, next) => {
    getPizzaByName(req, res, next);
});

router.get('/sort/:price', (req, res, next) => {
    getPizzaByPrice(req, res, next);   
});

router.delete('/:name', (req, res, next) => {
    deletePizza(req, res, next);
});

router.put('/:name', (req, res, next) => {
    updatePizza(req, res, next);
})

// -------------------------------------------------------------------------- //
//                              Functions                                     //
// -------------------------------------------------------------------------- //

/*
 * POST /pizza to post a pizza 
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
            res.json({ message: "Pizza successfully added :", savedPizza });
            res.status(200).end();
        }
    });
}

/*
 * GET /pizza to get a list of all pizzas
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

/*
 * GET /pizza/:name to get a pizza given its name
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

/*
 * GET /pizza/:price to get a pizzas given its price
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

/*
 * DELETE /pizza/:name to delete a pizza given its name 
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

/*
 * PUT /pizza/:name to update a pizza given its name
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
 * @params({function}) base64 - base64 to decode
 */
function decodeBase64(base64){
  return new Buffer.from(base64, 'base64');
}

/**
 * @function encodeBase64
 * @params({function}) base64 - base64 to encode
 */
function encodeBase64(image){
  return new Buffer.from(image);
}

module.exports = router;