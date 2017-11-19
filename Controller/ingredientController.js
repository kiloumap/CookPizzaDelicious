'use strict';
/**
 * Controller Ingredient
 * @requires Model
 */

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

router.get('/sort', (req, res, next) => {
    getIngredientByNameSorted(req, res, next);
})

router.delete('/:name', (req, res, next) => {
    deleteIngredient(req, res, next);
})

router.put('/:name', (req, res, next) => {
    updateIngredient(req, res, next);
})

// -------------------------------------------------------------------------- //
//                              Functions                                     //
// -------------------------------------------------------------------------- //

/**
 * @function postIngredient
 * @param {function} req - json containing the ingredient body
 * @description POST ingredient 
 * @return {json} res - Ingredient
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

/**
 * @function getAllIngredients
 * @description GET all ingredients
 * @return {json} res - Ingredients
 */
function getAllIngredients(req, res, next) {
    Ingredient.find({}, null, { sort: { update_at: -1 } })
    .populate('ingredient_ids')
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

/**
 * @function getIngredientByName
 * @param {string} req - name
 * @description GET ingredient by name 
 * @return {json} res - Ingredient
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

/**
 * @function getIngredientByNameSorted
 * @description GET all ingredient sorted by name ascending 
 * @return {json} res - Ingredients
 */
function getIngredientByNameSorted(req, res, next){
    Ingredient.find({}, null, { sort: { weight: 1 } })
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


/**
 * @function deleteIngredient
 * @param {string} req - json containing the ingredient name
 * @description DELETE ingredient 
 * @return {json} res - Ingredient
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

/**
 * @function updateIngredient
 * @param {function} req - json containing the ingredient body
 * @description PUT ingredient 
 * @return {json} res - Ingredient
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