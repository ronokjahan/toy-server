const express = require('express')
const app = express()
const  cors = require('cors')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000
app.use(cors())
app.use(express.json())

console.log(process.env.USER)



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.v8fkcik.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const verfyjwt=(req,res,next)=>{
  const autorization=req.headers.autorization
  if(!autorization){
    res.status(401). send({error:true})
  }
  const token=autorization.split( ' ')[1]
  jwt.verify(token,process.env.Acess_token,(error,decoded))
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("Toy-website");
    const haiku = database.collection("Toy");
    const order = client.db("order-website");
    const confarm = order.collection("conferm-order");

    // jwt----
    app.post('/jwt',async(req,res)=>{
      const user=req.body
      console.log(user);
      const token=jwt.sign(user,process.env.Acess_token,{expiresIn:'1h'})
      res.send({token}),
      console.log(token);
    })
app.get('/servece',async(req,res)=>{
  const serves=haiku.find()
  const result=await serves.toArray()
  res.send(result)
   
  
})
app.get('/servece/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const options = {
    
    projection: { _id: 0, title: 1, price: 1,img:1,service_id:1 },
  };

  const result=await haiku.findOne(query,options)
  res.send(result)
})
app.post('/orders',async(req,res)=>{
  const datas=req.body
  console.log(datas);
  const result=await confarm.insertOne(datas)
  res.send(result)
})
// confarm-order------------------------------
app.get('/orders',verfyjwt, async(req,res)=>{
  const queryd=confarm.find()
  let query={};
  if(req.query?.email){

    query={email:req.query.email}
  }
  const result=await queryd.toArray()
  res.send(result)
})
app.get('/orders/:id',async(req,res)=>{
  const id=req.params.id 
  const query={_id:new ObjectId(id)}
  const result=await confarm.findOne(query)
  res.send(result)
})
app.delete('/orders/:id',async(req,res)=>{
  const id=req.params.id 
  const quert={_id:new ObjectId(id)}
  const result =await confarm.deleteOne(quert)
  res.send(result)
})

app.put('orders/:id',async(req,res)=>{
  const id=req.params.id
  const filtr={_id:new ObjectId(id)}
  const updateording=req.body
  const updateDoc = {
    $set: {
      plot: `A harvest of random numbers, such as: ${Math.random()}`
    },
  };
  const result=await confarm.updateOne(filtr,updateDoc)
  res.send(result)
  console.log(updateording);
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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})