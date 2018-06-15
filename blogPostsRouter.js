const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { BlogPosts } = require('./models');

const jsonParser = bodyParser.json();

BlogPosts.create('Title 1', 'qwerty', 'Max')
BlogPosts.create('Title 2', 'asdfgh', 'Max')
BlogPosts.create('Title 3', 'zxcvbn', 'Max')

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    // ensure correct params are in request body
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const entry = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author,
        req.body.publishDate
    );
    res.status(201).json(entry);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted recipe \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }
    //error handling
    if (req.params.id !== req.body.id) {
        const msg = `ID's must match. Param ID: ${req.params.id} not found`;
        console.log(msg);
        return res.status(400).send(msg);
    }
    // no error, then update all fields to match headers
    console.log(`Updating recipe with ID: ${req.params.id}`);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate,
    });
    res.status(204).end()
})

module.exports = router;