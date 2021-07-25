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

module.exports.get = async (event, context, callback) => {
  const params = {
    TableName: process.env.TODO_TABLE,
    Key: {
      ID: event.pathParameters.id
    }
  };

  const result = await dynamodb.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

module.exports.getAll = async (event, context, callback) => {
  const params = {
    TableName: process.env.TODO_TABLE
  };

  const result = await dynamodb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
};

module.exports.update = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;

  const params = {
    TableName: process.env.TODO_TABLE,
    Item: {
      ID: event.pathParameters.id,
      Title: title
    }
  };

  await dynamodb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ 'message': 'Todo updated successfully' })
  };
}
