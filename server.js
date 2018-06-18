const express = require('express');
const morgan = require('morgan');

const {BlogPosts} = require('./models');

const app = express();


// log the http layer
app.use(morgan('common'));

app.use(express.static("public")); //what does this line do?

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

const blogPostsRouter = require('./blogPostsRouter');
app.use('/blogposts', blogPostsRouter)

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                reject(err);
            });
    });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}


module.exports = {app, runServer, closeServer};