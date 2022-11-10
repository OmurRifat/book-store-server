const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qogqlqn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const bookStore = client.db("bookStore").collection("books");
const bookReviews = client.db("bookReviews").collection("reviews");

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        //jwt token
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
            res.send({ token })
        })
        //api for home section books
        app.get('/homebooks', async (req, res) => {
            const query = {};
            const preBooks = await bookStore.find(query).toArray();
            const newBooks = await preBooks.reverse().splice(0, 3);
            res.send(newBooks);
        });
        //api for all books
        app.get('/allbooks', async (req, res) => {
            const query = {};
            const books = await bookStore.find(query).toArray();
            res.send(books);
        });
        //api for individual book
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectID(id) };
            const book = await bookStore.find(query).toArray();
            res.send(book);
        })
        //api for prilimenary reviews
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(typeof (id))
            const query = { bookId: id };
            const reviews = await bookReviews.find(query).sort({ date: -1 }).toArray();
            // console.log(reviews)
            res.send(reviews);
        })
        //api for inserting book details
        app.post('/addbooks', async (req, res) => {
            const newBook = req.body;
            const result = await bookStore.insertOne(newBook);
            res.send(result);
            // console.log(newBook)
        })
        //api for inserting new review
        app.post('/reviews/:id', async (req, res) => {
            const newReview = req.body;
            // console.log(newReview)
            const result = await bookReviews.insertOne(newReview);
            res.send(result);
        })
        //api for deleting owner review
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            // console.log(newReview)
            const result = await bookReviews.deleteOne(query);
            res.send(result);
        })
        //api for showing owner reviews
        app.get('/myreviews', verifyJWT, async (req, res) => {
            const email = req.query.email;
            // console.log(email)
            const query = { reviewerEmail: email }
            const myReview = await bookReviews.find(query).toArray();
            res.send(myReview)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send("Hey I am working..!")
});

app.listen(port, () => {
    console.log("Running in the port: ", port)
})