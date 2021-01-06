const { WebClient }  = require('@slack/web-api');

// configure dotenv
require('dotenv').config()

const web = new WebClient('xoxp-479571536320-480517108405-738942749959-6004caaeb33ebb7d0cc2ca817b5af8b8');

const types = {
  error: '#error-logs',
  account_creation: '#account_creation',
  financial: '#financial-logs',
  order: '#orders',
  loan: '#loans',
  saving_plan: '#saving-plan'
};

const logToSlack = async ({
  type, message, title, params,
}) => {
  let fields = [];

  if (params) {
    const paramKeys = Object.keys(params);
    fields = paramKeys.map((param) => ({ title: param, value: params[param] || 'NULL' }));
  }

  const res = await web.chat.postMessage({
    channel: type,
    attachments: [
      {
        pretext: title || 'Error',
        text: JSON.stringify(message),
        color: '#FF0000',
        mrkdwn_in: ['text', 'pretext'],
      },
      {
        title: 'Params',
        color: 'warning',
        mrkdwn_in: ['text', 'pretext'],
        fields,
        footer: 'PayFi Core',
      },
    ],
  });

  console.log(res, '===slack res');
  return res;
}

module.exports = {
  logToSlack,
  types
}