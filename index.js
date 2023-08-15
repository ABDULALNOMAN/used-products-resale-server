const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_KEY}@cluster0.epy9glr.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost:27017/"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() => {
    try {
        const userServices = client.db("gsmarea").collection('category')
        const servicesProducts = client.db('gsmarea').collection('products')
        const availableBooking = client.db('gsmarea').collection('advertizeitem')
        const userInformation = client.db('gsmarea').collection('identity')

        app.get('/services', async(req, res) => {
            const query = {}
            const result = await userServices.find(query).toArray()
            res.send(result)
        })
        app.get('/category/:name',async(req,res)=>{
            const name = req.params.name;
            const query = {categroy:name}
            const result = await servicesProducts.find(query).toArray()
            res.send(result)
        })
        app.put('/bookitem',async(req,res)=>{
            const query = req.query.id;
            const item = req.body 
            const filter = { _id: ObjectId(query)}
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
            const query = req.body;
            const userInfo = await userInformation.findOne(email)
            if (userInfo.visitor != 'seller') {
                res.status(401).send({messege:'invalid user'})
            }
            else{
                const result = await servicesProducts.insertOne(query)
                res.send(result)
            }
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
            const query = {}
            const result = await userInformation.find(query).toArray()
            const datas = result.filter(data=> data.visitor ==='seller')
            res.send(datas)
        })
        app.get('/alluser',async(req,res)=>{
            const query = { }
            const result = await userInformation.find(query).toArray()
            const datas = result.filter(data=>data.visitor==='user')
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
            const result = await userInformation.findOne(email, {visitor:"user"})
            res.send(result)
        })
        app.get('/sellerCheck', async(req, res) => {
            const query = req.query.seller;
            const email = {email:query}
            const result = await userInformation.findOne(email, {visitor:"seller"})
            res.send(result)
        })
        app.get('/admincheck', async(req, res) => {
            const query = req.query.admin;
            const email = {email:query}
            const result = await userInformation.findOne(email, {visitor:"admin"})
            res.send(result)
        })
        app.get('/myproducts',async(req,res)=>{
            const data = req.query.email;
            const email={seller_email:data }
            const result = await servicesProducts.find(email).toArray()
            res.send(result)
        })
        app.post('/advertize', async(req, res) => {
            const query = req.body;
            const result = await availableBooking.insertOne(query)
            res.send(result)
        })
        app.delete('/deleteadvatise', async(req, res) => {
            const query = req.query.id
            const id = { _id: ObjectId(query) }
            const result = await servicesProducts.deleteOne(id)
            res.send(result)
        })
        app.get('/homeadvertise', async(req, res) =>{
            const query = {}
            const result = await availableBooking.find(query).toArray()
            res.send(result)
        })
    }
    finally {
        
    }
}
run().catch(error=>console.log(error))




app.get('/', (req, res) => {
    res.send('hello world gsmarea')
})
app.listen(port,()=> {
    console.log('hello world welcome to gsmArea')
})

