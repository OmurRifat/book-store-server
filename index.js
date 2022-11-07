const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hey I am working..!")
});

app.listen(port, () => {
    console.log("Running in the port: ", port)
})