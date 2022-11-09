const express = require('express');
const cors = require('cors');
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


async function run() {
    try {
        //api for home section books
        app.get('/homebooks', async (req, res) => {
            const query = {};
            const books = await bookStore.find(query).limit(3).toArray();
            res.send(books);
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
            const reviews = await bookReviews.find(query).toArray();
            // console.log(reviews)
            res.send(reviews);
        })
        //api for inserting new review
        app.post('/reviews/:id', async (req, res) => {
            const newReview = req.body;
            // console.log(newReview)
            const result = await bookReviews.insertOne(newReview);
            res.send(result);
        })
        //api for showing owner reviews
        app.get('/myreviews', async (req, res) => {
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