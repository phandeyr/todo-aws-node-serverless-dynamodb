'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;

  if (!title) {
    callback(new Error('Title is required to create todo'));
    return;
  }

  const params = {
    TableName: process.env.TODO_TABLE,
    Item: {
        'ID': context.awsRequestId,
        'Title': title
    }
  };

  await dynamodb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ 'message': 'Todo created successfully' })
  };
};
