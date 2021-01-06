const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const { getPendingSavingPlan } = require('./db');
const { sendMessageToQueue } = require('./queue');
const { logToSlack, types } = require('./slack');

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.use('/', async (req, res) => {
  try {
    const savings = await getPendingSavingPlan()

    const queueResponse = await sendMessageToQueue(savings)

    return res.json(queueResponse);
  } catch (err) {
    // await logToSlack({
    //   type: types.error,
    //   title: 'sendMessageToQueue is failing',
    //   message: JSON.stringify(err)
    // })
  }
});


app.listen(3000, function () {
  console.log("App started")
});

module.exports = app
