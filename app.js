const express = require('express')
const app = express()
const port = 3000

level = 1
tasks = [{id: 1, title: "Take a walk"}, {id: 2, title: "Water the flower"}, {id: 3, title: "Clean the dishes"}]

app.get('/level', (req, res) => {
  res.send({ level })
})

app.get('/tasks', (req, res) => {
  res.send({ tasks })
})

app.post('/reset', (req, res) => {
  level = 1
  tasks = [{id: 1, title: "Take a walk"}, {id: 2, title: "Water the flower"}, {id: 3, title: "Clean the dishes"}]
  res.send('Reset successful');
})

app.delete('/tasks/:id', (req, res) => {
  id = req.params.id
  tasks = tasks.filter(x => {return x.id != id})
  level += 1

  res.status(200).send('Task completed');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})