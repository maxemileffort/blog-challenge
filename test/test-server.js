const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function(){
    before(function () {
        return runServer();
    })

    after(function () {
        return closeServer();
    })

    it('should list blog posts on GET', function(){
        return chai.request(app)
            .get('/blogposts')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["id", "title", "content", "author", "publishDate"];
                res.body.forEach(function(item){
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                })
            })
    })

    it('should create a new post on POST', function(){
        const newPost = {
            title: 'Title 4',
            content: "12345",
            author: 'Scooby',
            publishDate: Date.now()
        }
        return chai.request(app)
            .post('/blogposts')
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object')
                expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate")
                expect(res.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}))
            })
    })

    it('should update a post on PUT', function(){
        
        return chai.request(app)
            .get('/blogposts')
            .then(function(res){
                const updatePost = {
                    title: res.body[0].title + "[updated]",
                    id: res.body[0].id,
                    content: res.body[0].content,
                    author: res.body[0].author,
                    publishDate: res.body[0].publishDate
                }
                return chai.request(app)
                    .put(`/blogposts/${updatePost.id}`)
                    .send(updatePost)
                    
            })
            .then(function(res){
                expect(res).to.have.status(204);
                
            })
    })

    it('should delete post on DELETE', function(){
        return chai.request(app)
            .get('/blogposts')
            .then(function(res){
                return chai.request(app)
                    .delete(`/blogposts/${res.body[0].id}`)
            })
            .then(function(res){
                expect(res).to.have.status(204);
            })
    })
})