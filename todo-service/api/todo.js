'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Creates a todo item
module.exports.create = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;

  if (!title) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Title is required to create todo' })
    };
  }

  const params = {
    TableName: process.env.TODO_TABLE,
    Item: {
        'ID': context.awsRequestId,
        'Title': title
    }
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ 'message': 'Todo created successfully' })
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Unable to create todo' })
    };
  }
};

// Gets a todo item by ID
module.exports.get = async (event, context, callback) => {
  const params = {
    TableName: process.env.TODO_TABLE,
    Key: {
      ID: event.pathParameters.id
    }
  };

  try {
    const result = await dynamodb.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Unable to get todo' })
    };
  }

};

// Gets all todo items
module.exports.getAll = async (event, context, callback) => {
  const params = {
    TableName: process.env.TODO_TABLE
  };

  try{
    const result = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Unable to get todos' })
    };
  }
};

// Updates a todo item by ID
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

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ 'message': 'Todo updated successfully' })
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Unable to update todo' })
    };
  }
}

// Deletes a todo item by ID
module.exports.delete = async (event, context, callback) => {
  const params = {
    TableName: process.env.TODO_TABLE,
    Key: {
      ID: event.pathParameters.id
    },
    ReturnValues: 'ALL_OLD',
    Exists: true
  };

  try {
    const result = await dynamodb.delete(params).promise();

    if (!result.Attributes) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 'message': 'Unable to delete todo' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ 'message': 'Todo deleted successfully' })
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 'message': 'Unable to delete todo' })
    };
  }
}
