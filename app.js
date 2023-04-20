const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = 3000
app.use(cors())

const uri = `mongodb+srv://lyxthong:SWvan0rFOHDcubpn@virtual-pet.gplwczq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

level = 1
color = 1
global_id = 4
tasks = [{id: 1, title: "Take a walk"}, {id: 2, title: "Water the flower"}, {id: 3, title: "Clean the dishes"}]
completed_tasks = []

// get level
app.get('/level', async (req, res) => {
  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")
  let result = await collection.find({}).toArray()

  res.send({ "level": result[0]["level"] })
})

// get color
app.get('/color', async (req, res) => {
  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")
  let result = await collection.find({}).toArray()

  res.send({ "color": result[0]["color"] })
})

// get incomplete tasks
app.get('/tasks', async (req, res) => {
  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")
  let result = await collection.find({}).toArray()

  res.send({ "color": result[0]["tasks"] })
})

// get completed tasks
app.get('/completed-tasks', async (req, res) => {
  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")
  let result = await collection.find({}).toArray()

  res.send({ "color": result[0]["completed_tasks"] })
})

// reset the app
app.post('/reset', async (req, res) => {
  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")
  await collection.updateOne({}, { $set: { "level": 1 } }, { upsert: true })
  await collection.updateOne({}, { $set: { "color": 1 } }, { upsert: true })
  await collection.updateOne({}, { $set: { "global_id": 4 } }, { upsert: true })
  await collection.updateOne({}, { $set: { "tasks": [{id: 1, title: "Take a walk"}, {id: 2, title: "Water the flower"}, {id: 3, title: "Clean the dishes"}] } }, { upsert: true })
  await collection.updateOne({}, { $set: { "completed_tasks": [] } }, { upsert: true })
  
  res.send('Reset successful');
})

// add new tasks
app.post('/add-task', async (req, res) => {
  task = req.query.task;
  if (task !== "") {
    let conn = await client.connect()
    let db = await conn.db("client_0")
    let collection = await db.collection("clients")

    let result = await collection.find({}).toArray()
    global_id = result[0]["global_id"]

    await collection.updateOne({}, { "$push": { "tasks": {id: global_id, title: task} } }, { upsert: true })
    await collection.updateOne({}, { "$set": { "global_id": global_id + 1 } }, { upsert: true })

    res.send('Task added');
  }
})

// set color
app.post('/set-color', async (req, res) => {
  if (req.query.color !== "") {
    let conn = await client.connect()
    let db = await conn.db("client_0")
    let collection = await db.collection("clients")
    await collection.updateOne({}, { $set: { "color": parseInt(req.query.color) } }, { upsert: true })

    res.send('Color recorded');
  }
})

// delete (complete) a task
app.delete('/tasks/:id', async (req, res) => {
  id = parseInt(req.params.id)

  let conn = await client.connect()
  let db = await conn.db("client_0")
  let collection = await db.collection("clients")

  let result = await collection.find({}).toArray()
  let tasks = result[0]["tasks"]
  let completed_tasks = result[0]["completed_tasks"]

  completed_tasks.push(tasks.filter(x => {return x.id === id})[0])
  tasks = tasks.filter(x => {return x.id != id})

  await collection.updateOne({}, { "$set": { "completed_tasks": completed_tasks } }, { upsert: true })
  await collection.updateOne({}, { "$set": { "tasks": tasks } }, { upsert: true })
  await collection.updateOne({}, { "$inc": { "level": 1 } }, { upsert: true})

  res.status(200).send('Task completed');
})

// start the app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})