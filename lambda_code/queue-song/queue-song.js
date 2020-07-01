const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION
});

exports.handler = async event => {
  // fetch party owner connection id
  const partyId = JSON.parse(event.body).partyId;

  const queryParams = {
    TableName: process.env.PARTY_TABLE_NAME,
    Key: {
      partyId
    }
  };
  let party = await ddb.get(queryParams).promise();
  let ownerConnectionId = '';
  if (party && party.Item && party.Item.owner) {
    ownerConnectionId = party.Item.owner.connectionId
  } else {
    return {
      statusCode: 500,
      body: 'owner disconnected from party, unable to make queue request'
    }
  }

  const connectionId = event.requestContext.connectionId;
  if (connectionId == ownerConnectionId) {
    // owner confirmed the song has been queued, update the queue state
  } else {
    // send queue request to owner
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });
    try {
      await apigwManagementApi.postToConnection({
        ConnectionId: ownerConnectionId,
        Data: JSON.stringify({
          track: JSON.parse(event.body).track
        })
      }).promise();
    } catch (e) {
      return {
        statusCode: 500,
        body: 'owner disconnected from party, unable to make queue request'
      }
    }

  }

  return {
    statusCode: 200,
    body: 'queue song message received'
  };
};