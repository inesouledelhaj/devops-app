const express = require('express');
const app = express();
const client = require('prom-client')
const { histogram } = require('./histogram');
const { gauge } = require('./gauge');
const { summary } = require('./summary');
const { counter } = require('./counter');

let toDo = {"monday":"start pfe","tuesday":"finish pfe","thursday":"start job"};

app.get('/', (req, res) => {
  res.send('Hello from ToDo Apdp!');
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
client.collectDefaultMetrics({
  app: 'devops-app',
  prefix: 'node_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
  register
});

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
});
// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Other custom metrics and its usage

// other histograms
histogram(register);

// gauge
gauge(register);

// summary
summary(register);

// counter
counter(register);


app.get('/metrics', async (req, res) => {
     // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}... metrics are exposed on ${PORT}/metrics`);
});









