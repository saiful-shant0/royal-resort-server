const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.med0q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('Resort_Services');
        const serviceCollection = database.collection('Services');
        const orderCollection = database.collection('orders');



        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })


        //ADD order Api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        app.get('/myorders', async (req, res) => {
            const email = req.query.email;

            const query = { email: email }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })


        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);



            res.json(result);
        })
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log('Server running at port', port)
})