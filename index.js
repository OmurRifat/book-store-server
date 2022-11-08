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


async function run() {
    try {
        app.get('/homebooks', async (req, res) => {
            const query = {};
            const books = await bookStore.find(query).limit(3).toArray();
            res.send(books);
        });

        app.get('/allbooks', async (req, res) => {
            const query = {};
            const books = await bookStore.find(query).toArray();
            res.send(books);
        });

        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectID(id) };
            const book = await bookStore.find(query).toArray();
            res.send(book);
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