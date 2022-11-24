const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT||5000


// middleware
app = (cors())
app = (express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.epy9glr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(port,()=> {
    console.log('hello world welcome to gsmArea')
})

