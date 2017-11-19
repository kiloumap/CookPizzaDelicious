'use strict';
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const Ingredient = require('../Model/ingredientSchema');

// Data of a second test ingredient
const ingredientToPut = {
    "name": "Base tomate",
    "weight": "6",
    "price": 2,
    "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
}

// ingredient with missing fields
const ingredientFake = {
    "name": "Base tomate",
    "weight": "3"
}

chai.use(chaiHttp);
describe('ingredient', () => {
    beforeEach((done) => { // Before each test we empty the database test
        Ingredient.remove({}, (err) => { 
           done();         
        });     
    });
    
     /*
      * Test the /GET/
      */
    describe('/GET ingredient', () => { 
      it('it should GET all the ingredient', (done) => {
        chai.request(server)
            .get('/ingredient')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
    });
    
     /*
      * Test the /POST
      */    
    describe('/POST ingredient', () => {
        it('it should not POST a ingredient without price field', (done) => {
        chai.request(server)
            .post('/ingredient')
            .set('content-type', 'application/json')
            .send(ingredientFake)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.an('object');
                res.body.message.should.have.property('errors');
                res.body.message.errors.should.have.property('price');
                res.body.message.errors.price.should.have.property('kind').eql('required');
              done();
            });
        });
        it('it should POST a ingredient with fields', (done) => {
        let ingredientToAdd = new Ingredient({
            "name": "Base tomate",
            "weight": "3",
            "price": 2,
            "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
        });
        chai.request(server)
            .post('/ingredient')
            .set('content-type', 'application/json')
            .send(ingredientToAdd)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Ingredient successfully added :');
                res.body.savedIngredient.should.have.property('name');
                res.body.savedIngredient.should.have.property('price');
                res.body.savedIngredient.should.have.property('weight');
                res.body.savedIngredient.should.have.property('pizza_ids');
                done();
            });
        });
    });
    
     /*
      * Test the /GET/:name route
      */
    describe('/GET/:id ingredient', () => {
        it('it should GET a ingredient by the given name', (done) => {
            let ingredientToAdd = new Ingredient({
                "name": "Base tomate",
                "weight": "3",
                "price": 2,
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            ingredientToAdd.save((err, ingredient) => {
                chai.request(server)
                .get('/ingredient/'+ ingredient.name)
                .set('content-type', 'application/json')
                .send(ingredient)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(ingredient.name);
                    res.body.should.have.property('weight');
                    res.body.should.have.property('price');
                    res.body.should.have.property('pizza_ids');
                    done();
                });
            });
        });
    });
    
     /*
      * Test the /PUT/:name route
      */
    describe('/PUT/:name ingredient', () => {
        it('it should UPDATE a pizza given the name', (done) => {
            let ingredientToAdd = new Ingredient({
                "name": "Base tomate",
                "weight": "3",
                "price": 2,
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            ingredientToAdd.save((err, ingredient) => {
                chai.request(server)
                .put('/ingredient/' + ingredient.name)
                .set('content-type', 'application/json')
                .send(ingredientToPut)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    console.log(res.body);
                    res.body.should.have.property('message').eql('Ingredient successfully updated!');
                    res.body.ingredient.should.have.property('name').eql(ingredientToPut.name);
                    res.body.ingredient.should.have.property('price').eql(ingredientToPut.price);
                    res.body.ingredient.should.have.property('weight').eql(ingredientToPut.weight);
                    done();
                });
            });
        });
    });
    
     /*
      * Test the /DELETE/:name route
      */
    describe('/DELETE/:name ingredient', () => {
        it('it should DELETE a pizza given the name', (done) => {
            let ingredientToAdd = new Ingredient({
                "name": "Base tomate",
                "weight": "3",
                "price": 2,
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            ingredientToAdd.save((err, ingredient) => {
                chai.request(server)
                .delete('/ingredient/' + ingredient.name)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Ingredient successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                    done();
                });
            });
        });
    });
});