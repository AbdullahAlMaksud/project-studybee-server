const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors())


//MONGODB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmxqify.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const servicesCollection = client.db('servicesDB').collection('services')
        const bookedServices = client.db('servicesDB').collection('bookedServices')

        app.get('/services', async (req, res) => {
            const cusor = servicesCollection.find()
            const result = await cusor.toArray()
            res.send(result)
        })

        app.post('/services', async (req, res) => {
            const newServices = req.body;
            const result = await servicesCollection.insertOne(newServices)
            res.send(result)
            console.log(newServices)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.send(result)
        })
        app.post('/bookedService', async (req, res) => {
            const newBookedService = req.body;
            const result = await bookedServices.insertOne(newBookedService)
            res.send(result)
            console.log(newBookedService)
        })

        app.get('/bookedService', async (req, res) => {
            const cursor = bookedServices.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();

    }
}
run().catch(console.dir);


//Server
app.get('/', async (req, res) => {
    res.send('Server is running....');
})

app.listen(port, () => {
    console.log(`This Server is running on PORT: ${port}`);
})