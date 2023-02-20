const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


//cors
app.use(cors());
//middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to Sports World")
})




//MongoDb 

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@portfolio.zka99gz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        const productCollection = client.db('test').collection("watchcollections")



        app.get('/allProducts', async (req, res) => {
            const query = {}
            const product = await productCollection.find(query).toArray();
            res.send({ success: true, product });
        })

        app.get('/products', async (req, res) => {
            const search = req.query.search;
            let query = {}
            console.log(search);
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }
            }
            const product = await productCollection.find(query).toArray();
            res.send({ status: true, product });
        })


        app.get('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.send(product);
        })





    } finally {

    }


}
run().catch((err) => console.error(err))






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})