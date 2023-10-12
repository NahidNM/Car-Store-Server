const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const cors = require('cors');
require('dotenv').config()


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo7sbx1.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

// mongobd Collection
    const allCarCollection = client.db('CarStore').collection('AllCars');


// All Car get data base
app.get('/allCar', async(req, res) =>{
    const cursor = allCarCollection.find();
    const result = await cursor.toArray();
    // console.log(result)
    res.send(result)
  })


  // Get id For Car Details
app.get('/allCar/:id', async(req, res)=>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)}
  const user = await allCarCollection.findOne(query)
  // console.log(user)
  res.send(user)
})


// Get add My toys
app.get('/myCar/:email', async(req, res)=>{
  const result = await allCarCollection.find({email: req.params.email}).toArray()
  res.send(result)
})


// upload My Car data
app.post('/addCar', async(req,  res) =>{
  const cardata = req.body;
  const result = await allCarCollection.insertOne(cardata);
  res.send(result)
})


// Delete My toys
app.delete('/myCar/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await allCarCollection.deleteOne(query);
  res.send(result);
})

// Update My toys
app.put('/myCar/:id', async (req, res) => {
  const id = req.params._id;
  const filter = { _id: new ObjectId(id) };
  const options = {upset: true };
  const updatedMyToys = req.body;
  
  const updateDoc = {
      $set: {
          // status: updatedMyToys.status
          name: updatedMyToys.name,
          quantity: updatedMyToys.quantity,
          price: updatedMyToys.price,
          description: updatedMyToys.description    
      },
  };
  const result = await allCarCollection.updateOne(filter, updateDoc, options);
  res.send(result);
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("Cars is running");
    });
    
    
    
    app.listen(port, ()=>{
        console.log(`Cars api is running on port : ${port}`)
    })