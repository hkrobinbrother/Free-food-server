  const express = require('express');
  const cors = require('cors');
  const app = express();
  require('dotenv').config()
  const port = process.env.PORT || 3000;
  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

  // middleware
  app.use(cors());
  app.use(express.json());




  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSS}@cluster0.d1icoll.mongodb.net/?appName=Cluster0`;
  console.log(uri)

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });



  async function run() {
    try {
      // Connect the client to the server
      await client.connect();

      const foodCollection = client.db("foodDB").collection("food")
      // get data
      app.get("/food",async(req,res)=>{
          const cursor = foodCollection.find();
          const result = await cursor.toArray();
          res.send(result)
      })

      // get one

      app.get("/food/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const item = await foodCollection.findOne(query)
        res.send(item)
      })

      // get all food posted bt  a specific user

      app.get('/food/byEmail/:email',async (req,res)=>{
        const email = req.params.email
        const query = {'post.email' : email}
        const result = await foodCollection.find(query).toArray()
        res.send(result)
      })




      // post data
      app.post("/food", async(req,res)=>{
          const newFood = req.body;
          console.log(newFood)
          const result = await foodCollection.insertOne(newFood)
          res.send(result)
      })


      // deleted data

      app.delete("/food/:id" ,async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await foodCollection.deleteOne(query)
        res.send(result)
      })



      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    
      // await client.close();
    }
  }
  run().catch(console.dir);








  app.get('/', (req, res) => {
    res.send('coffee server is running!')
  })

  app.listen(port, () => {
    console.log(`coffee server in running on port ${port}`)
  })