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
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() => {
    try {
        const userServices = client.db('gsmarea').collection('category')

        app.get('/services', async(req, res) => {
            const query = {}
            const result = await userServices.find(query).toArray()
            res.send(result)
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

