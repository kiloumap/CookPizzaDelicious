'use strict';
// -------------------------------------------------------------------------- //
//                              Recuperation                                  //
// -------------------------------------------------------------------------- //
const Ingredient = require('../Model/ingredientSchema');
const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------- //
//                                Routes                                      //
// -------------------------------------------------------------------------- //

router.post('/', (req, res, next) => {
    postIngredient(req, res, next);
});

router.get('/', (req, res, next) => {
    getAllIngredients(req, res, next);
})

router.get('/:name', (req, res, next) => {
    getIngredientByName(req, res, next);
})

router.delete('/:name', (req, res, next) => {
    deleteIngredient(req, res, next);
})

router.put('/:name', (req, res, next) => {
    updateIngredient(req, res, next);
})

// TODO: Create the Read API (list all ingredient (order by name asc) / get only one from name or price or pizza_ids or created_at)
// TODO: Create the Update API

// -------------------------------------------------------------------------- //
//                              Functions                                     //
// -------------------------------------------------------------------------- //

/*
 * POST /ingredient to post a ingredient 
 */
function postIngredient(req, res, next) {
    //Creates a new Ingredient
    const newIngredient = new Ingredient(req.body);
    //Save it into the DB.
    newIngredient.save((err, savedIngredient) => {
        if (err) {
            res.status(500);
            res.json({ message: err });
        }
        else { //If no errors, send it back to the client
            res.json({ message: "Ingredient successfully added :", savedIngredient });
            res.status(200).end();
        }
    });
}

/*
 * GET getAllIngredients
 */
function getAllIngredients(req, res, next) {
    Ingredient.find({}, null, { sort: { update_at: -1 } })
    //.populate('ingredient_ids')
    .exec((err, ingredients) => {
        if (err) {
            res.status(500);
            res.json({ message: err });
        }
        else {
            res.status(200).json(ingredients);
        }
    });
}

/*
 * GET /Ingredient/:name to get a ingredient given its name
 */
function getIngredientByName(req, res, next){
    Ingredient.findOne({name : req.params.name}, (err, ingredient) =>{
        if(err){
          res.send(err);
        } else { //If no error, send ingredient
            res.json(ingredient);
        }
    })
}

/*
 * DELETE /ingredient/:name to delete a ingredient given its name 
 */
function deleteIngredient(req, res){
    Ingredient.remove({name : req.params.name}, (err, result) => {
        if(err){
            res.send(err);
        } else {
            res.json({ message: "Ingredient successfully deleted!", result });
        }
    })
}

/*
 * PUT /ingredient/:name to update a Ingredient given its name
 */
function updateIngredient(req, res) {
     Ingredient.findOneAndUpdate({name : req.params.name}, req.body, {new: true}, function (err, ingredient) {
        if (err) {
            res.send(err);
        } else {
            // res.status(200).send(pizza);
            res.json({message: "Ingredient successfully updated!", ingredient });
        }
    });
}

module.exports = router;