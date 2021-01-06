const AWS = require('aws-sdk');
const { logToSlack, types } = require('./slack');

// configure dotenv
require('dotenv').config()

// const {
//   PAYFI_AWS_REGION,
//   PAYFI_AWS_SECRET_ACCESS_KEY,
//   PAYFI_AWS_ACCESS_KEY_ID,
// } = process.env;

AWS.config.update({
  accessKeyId: 'AKIATYYCAV7KNMS4J5AG',
  secretAccessKey:
    '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',
  region: 'us-east-1',
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueUrl = 'https://sqs.us-east-1.amazonaws.com/259312889812/SAVING_PLAN';


const sendMessageToQueue = message => {
  const data = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl
  }

  return new Promise((resolve,reject) => {
  sqs.sendMessage(data, async (err, data) => {
    if (err) {
      reject(err)
    } // an error occurred
    else {
      await logToSlack({
        type: types.saving_plan,
        title: 'New saving plans has been added to queue',
        message: JSON.stringify(data)
      })

      resolve(data)
    };  // successful response
  });
  })
}

module.exports = {
  sendMessageToQueue
}
