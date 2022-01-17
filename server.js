const express = require('express');
const app = express();
const client = require('prom-client')

let toDo = {"monday":"start pfe","tuesday":"finish pfe","thursday":"start job"};

app.get('/', (req, res) => {
  res.send('Hello from ToDo App!');
});

app.get('/delete-todo/:day', (req, res) => {
    delete toDo[req.params.day];
    res.send(toDo);
});

app.get('/add-todo/:day/:task', (req, res) => {
      if(toDo[req.params.day]){
        toDo[req.params.day] = toDo[req.params.day]+','+ req.params.task;
      }else
        toDo[req.params.day] = req.params.task;
    res.send(toDo);
});

  // Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'devops-app'
})

// Enable the collection of default metrics
client.collectDefaultMetrics({ register })


app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});









