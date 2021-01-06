const AWS = require('aws-sdk');
const { logToSlack, types } = require('./slack');

// configure dotenv
require('dotenv').config()

const {
  PAYFI_AWS_REGION,
  PAYFI_AWS_SECRET_ACCESS_KEY,
  PAYFI_AWS_ACCESS_KEY_ID,
} = process.env;

AWS.config.update({
  accessKeyId: PAYFI_AWS_ACCESS_KEY_ID,
  secretAccessKey:
    PAYFI_AWS_SECRET_ACCESS_KEY,
  region: PAYFI_AWS_REGION,
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueUrl = process.env.SQS_QUEUE_URL;


const sendMessageToQueue = message => {
  const data = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl
  }

  return new Promise((resolve, reject) => {
    sqs.sendMessage(data, async (err, data) => {
      console.log(err, data);
      if (err) {
        reject(err)
      } // an error occurred
      else {
        // await logToSlack({
        //   type: types.saving_plan,
        //   title: 'New saving plans has been added to queue',
        //   message: JSON.stringify(data)
        // })

        resolve(data)
      };  // successful response
    });
  })
}

module.exports = {
  sendMessageToQueue
}
