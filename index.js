const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT||5000

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfebj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(uri)

async function run() {
    try {
        await client.connect();
        const database = client.db('watch-shop');
        const watchShopCollection = database.collection('shops');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');
        

        // shops collecton add 
        app.get('/shops', async (req, res) => {
            const email = req.query.email;
            const query = { email: email,}
            const cursor = watchShopCollection.find(query);
            const shops = await cursor.toArray();
            res.json(shops);
        })

        app.post('/shops', async (req, res) => {
            const shop = req.body;
            const result = await watchShopCollection .insertOne(shop);
            res.json(result)
        });

        // orders collection 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email,}
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });
        
        
        // review Collection 
        app.get('/reviews', async (req, res) => {
            const email = req.query.email;
            const query = { email: email,}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.json(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        });
        
    //  user admin collection 
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.json(result);
    });

    app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });
      

      

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Watch time running running')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})