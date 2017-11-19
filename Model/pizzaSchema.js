'use strict';
/**
 * Schéma Pizza
 * @module PizzaSchema
 */

/**
 * @requires Schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @class PizzaSchema
 * @param {String} name - Nameof the pizza (Required)
 * @param {String} desc - Short description of pizza (Required)
 * @param {String} picture - Image of pizza stocked in base 64
 * @param {Array} ingredients - Liste of ingredients (Required)
 * @param {Number} price - Price of pizza (Required)
 * @param {Date} create_at - Date of creation
 * @param {Date} update_at - Date of last update
 * @return {Schema}
 */
const PizzaSchema = new Schema({
  name: { type: String, unique: true, required: true },
  desc: { type: String, required: true },
  picture: { type: String },
  price: { type: Number, required: true },
  ingredient_ids: [{ type: Schema.Types.ObjectId, ref: 'Ingredient', required: true}],
  create_at: { type: Date },
  update_at: { type: Date },
});

/**
 * @function save
 * @param {function} next - Next middleware
 * @description Update create_date if is new document, update update_at else
 */
PizzaSchema.pre('save', function(next) {
  this.update_at = Date.now();
  if (this.isNew) {
    this.create_at = this.update_at;
  }
  
  // Update all ingredients
  mongoose.model('Ingredient')
    .update({ _id: { $in: this.ingredient_ids }},
    { $push: { pizza_ids: this._id }}, 
    { multi: true }).exec();
  next();
});

/**
 * @function findOneAndRemove
 * @param {function} next - next - Next middleware
 * @description Delete ingredients when deleting pizza
 */
PizzaSchema.pre('findOneAndRemove', function(next) {
  // Update all ingredients
  mongoose.model('Ingredient')
    .update({ _id: this.ingredient_ids }, 
    { $pull: { $contains : this._id}}, 
    { multi: true }).exec();
  next();
});

module.exports = mongoose.model('Pizza', PizzaSchema);