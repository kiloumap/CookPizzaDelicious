'use strict';
 /**
 * Schéma Ingredient
 * @module IngredientSchema
 */

/**
 * @requires Schema
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// Schema IngredientSchema
/**
 * @class IngredientSchema
 * @param {String} name - Name ingredient (Requis)
 * @param {String} weight - Weight (Requis)
 * @param {Number} price - Price (Requis)
 * @param {Array} pizza - Liste of pizzas
 * @param {Date} create_at - Date of create
 * @param {Date} update_at - Date of last update
 * @return {Schema}
 */
const IngredientSchema = new Schema({
    name      : { type: String, unique: true, required: true },
    weight    : { type: String, required: true },
    price     : { type: Number, required: true },
    pizza_ids : [{ type: Schema.Types.ObjectId, ref: 'Pizza'}],
    create_at : { type: Date },
    update_at : { type: Date },
});

/**
 * @function preSave
 * @param {function} next - Next middleware
 * @description Update create_date if is new document, update update_at else
 */
IngredientSchema.pre('save', function(next) {
  this.update_at = Date.now();
  if (this.isNew) {
    this.create_at = this.update_at;
  }
    // Update all pizzas
  mongoose.model('Pizza')
    .update({ _id: { $in: this.pizza_ids }},
    { $push: { ingredient_ids: this._id }}, 
    { multi: true }).exec();
  next();
});

module.exports = mongoose.model('Ingredient', IngredientSchema);