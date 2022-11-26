const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_KEY}@cluster0.epy9glr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() => {
    try {
        const userServices = client.db("gsmarea").collection('category')
        const servicesProducts = client.db('gsmarea').collection('products')
        const userBooking = client.db('gsmarea').collection('booking')
        const userInformation = client.db('gsmarea').collection('identity')

        app.get('/services', async(req, res) => {
            const query = {}
            const result = await userServices.find(query).toArray()
            res.send(result)
        })
        app.get('/category/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {categoryId:id}
            const result = await servicesProducts.find(query).toArray()
            res.send(result)
        })
        app.post('/bookitem',async(req,res)=>{
            const data = req.body
            const result = await userBooking.insertOne(data)
            res.send(result)
        })
        app.post('/userstore', async(req,res) => {
            const data = req.body;
            const result = await userInformation.insertOne(data)
            res.send(result)
            console.log(result)
        })
        app.get('/users', async (req, res) => {
            const email = req.query.email
            const result = await userInformation.findOne(email)
            if (result) {
                return res.send(result)
            }
        })
    }
    finally {
        
    }
}
run().catch(error=>console.log(error))




app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(port,()=> {
    console.log('hello world welcome to gsmArea')
})

