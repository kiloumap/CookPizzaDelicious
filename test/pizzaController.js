'use strict';
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose  = require("mongoose");

//Require the dev-dependencies
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../server');
const should    = chai.should();
const Pizza     = require('../Model/pizzaSchema');

// Data of a test pizza
const pizzaToPut = {
	"name"          : "Kebab",
    "price"         : 10,
    "desc"          : "La pizza kebab sur son lit de crème fraiche, un délice exotique !",
    "picture"       : "tata",
    "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
};

// Pizza with missing fields
const pizzaFake = {
    "name"          : "La Pizza",
    "desc"          : "Avec La description",
    "picture"       : "l'image",
};

chai.use(chaiHttp);
describe('Pizza', () => {
    beforeEach((done) => { // Before each test we empty the database test
        Pizza.remove({}, (err) => { 
           done();         
        });     
    });
    
     /*
      * Test the /GET/
      */
    describe('/GET pizza', () => { 
      it('it should GET all the pizza', (done) => {
        chai.request(server)
            .get('/pizza')
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
    describe('/POST pizza', () => {
        it('it should not POST a pizza without price field', (done) => {
        chai.request(server)
            .post('/pizza')
            .set('content-type', 'application/json')
            .send(pizzaFake)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.an('object');
                res.body.message.should.have.property('errors');
                res.body.message.errors.should.have.property('price');
                res.body.message.errors.price.should.have.property('kind').eql('required');
              done();
            });
        });
        it('it should POST a pziza with fields', (done) => {
        let pizzaToAdd = new Pizza({
            "name"          : "La Pizza",
            "price"         : 12,
            "desc"          : "Avec La description",
            "picture"       : "l'image",
            "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
        });
        chai.request(server)
            .post('/pizza')
            .set('content-type', 'application/json')
            .send(pizzaToAdd)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Pizza successfully added :');
                res.body.savedPizza.should.have.property('name');
                res.body.savedPizza.should.have.property('price');
                res.body.savedPizza.should.have.property('desc');
                res.body.savedPizza.should.have.property('picture');
                res.body.savedPizza.should.have.property('ingredient_ids');
                done();
            });
        });
    });
    
     /*
      * Test the /GET/:name route
      */
    describe('/GET/:id pizza', () => {
        it('it should GET a pizza by the given name', (done) => {
            let pizzaToAdd = new Pizza({
                "name"          : "La Pizza",
                "price"         : 12,
                "desc"          : "Avec La description",
                "picture"       : "l'image",
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            pizzaToAdd.save((err, pizza) => {
                chai.request(server)
                .get('/pizza/'+ pizza.name)
                .set('content-type', 'application/json')
                .send(pizza)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(pizza.name);
                    res.body.should.have.property('price');
                    res.body.should.have.property('desc');
                    res.body.should.have.property('picture');
                    res.body.should.have.property('ingredient_ids');
                    done();
                });
            });
        });
    });
    
     /*
      * Test the /PUT/:name route
      */
    describe('/PUT/:name pizza', () => {
        it('it should UPDATE a pizza given the name', (done) => {
            let pizzaToAdd = new Pizza({
                "name"          : "La Pizza",
                "price"         : 12,
                "desc"          : "Avec La description",
                "picture"       : "l'image",
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            pizzaToAdd.save((err, pizza) => {
                chai.request(server)
                .put('/pizza/' + pizza.name)
                .set('content-type', 'application/json')
                .send(pizzaToPut)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Pizza successfully updated!');
                    res.body.pizza.should.have.property('name').eql(pizzaToPut.name);
                    res.body.pizza.should.have.property('price').eql(pizzaToPut.price);
                    res.body.pizza.should.have.property('desc').eql(pizzaToPut.desc);
                    res.body.pizza.should.have.property('picture').eql(pizzaToPut.picture);
                    res.body.pizza.should.have.property('ingredient_ids').eql(pizzaToPut.ingredient_ids);
                    done();
                });
            });
        });
    });
    
     /*
      * Test the /DELETE/:name route
      */
    describe('/DELETE/:name pizza', () => {
        it('it should DELETE a pizza given the name', (done) => {
            let pizzaToAdd = new Pizza({
                "name"          : "La Pizza",
                "price"         : 12,
                "desc"          : "Avec La description",
                "picture"       : "l'image",
                "ingredient_ids": ["5a0eed119b47cd432f937647","5a0eecf69b47cd432f937643","5a0eecca9b47cd432f93763c"]
            });
            pizzaToAdd.save((err, pizza) => {
                chai.request(server)
                .delete('/pizza/' + pizza.name)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Pizza successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                    done();
                });
            });
        });
    });
});