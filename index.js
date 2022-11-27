const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.get('/category/:name',async(req,res)=>{
            const id = req.params.name;
            const query = {categroy:id}
            const result = await servicesProducts.find(query).toArray()
            res.send(result)
        })
        app.put('/bookitem',async(req,res)=>{
            const query = req.query.id;
            const item = req.body 
            const filter = { _id: ObjectId(query) }
            const options = { upsert: true };
            const updateDoc = {
                $set:{
                    customerInfo: item,
                    status:'sold'
                }
            }
            const result = await servicesProducts.updateOne(filter,updateDoc,options)
            res.send(result)
        })
        app.post('/userstore', async(req,res) => {
            const data = req.body;
            const result = await userInformation.insertOne(data)
            res.send(result)
        })
        app.post('/productsadd', async(req, res) => {
            const data = req.query.email;
            const email = { email: data }
            const userInfo = await userInformation.findOne(email)
            if (userInfo.user !== 'seller') {
                res.status(401).send({messege:'invalid user'})
            }
            const query = req.body;
            console.log(userInfo)
            const result = await servicesProducts.insertOne(query)
            res.send(result)
        })
        app.get('/users',async(req, res) => {
            const data = req.query.email
            const email={email:data}
            const result =await userInformation.findOne(email)
            if(result){
                return res.send(result)
            }
        })
        app.get('/allseller',async(req,res)=>{
            const query = { }
            const result = await userInformation.find(query).toArray()
            const datas = result.filter(data=>data.user==='seller')
            res.send(datas)
        })
        app.get('/alluser',async(req,res)=>{
            const query = { }
            const result = await userInformation.find(query).toArray()
            const datas = result.filter(data=>data.user==='user')
            res.send(datas)
        })
        app.delete('/userdelete',async(req,res)=>{
            const query = req.query.email;
            const email = {email:query}
            const result = await userInformation.deleteOne(email)
            res.send(result)
        })
        app.get('/buyersCheck', async(req, res) => {
            const query = req.query.buyer;
            const email = {email:query}
            const result = await userInformation.findOne(email)
            if (result) {
                if(result.user === 'user') {
                    res.send(result)
                    console.log(result)
                }
            }
        })
        app.get('/sellerCheck', async(req, res) => {
            const query = req.query.seller;
            const email = {email:query}
            const result = await userInformation.findOne(email)
            if (result) {
                if(result.user === 'seller') {
                    res.send(result)
                    console.log(result)
                }
            }
        })
        app.get('/myproducts',async(req,res)=>{
            const data = req.query.email;
            const email = { seller_email: data }
            const result = await servicesProducts.find(email).toArray()
            console.log(result)
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

