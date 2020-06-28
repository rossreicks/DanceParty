const AWS = require('aws-sdk');
const axios = require('axios');
const qs = require('qs');

exports.handler = async event => {
  // authenticate to spotify api
  const clientid = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const query = JSON.parse(event.body).query;

  const axios = require('axios');
  const qs = require('qs');

  const request = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      grant_type: 'client_credentials',
      client_id: clientid,
      client_secret: clientSecret
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })

  const accessToken = request.data.access_token;

  // take query request and make request to spotify
  const result = await axios.get('https://api.spotify.com/v1/search?type=track&q=' + query, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  })

  // send search results back to requester
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  await apigwManagementApi.postToConnection({
    ConnectionId: event.requestContext.connectionId,
    Data: result.tracks.items
  }).promise();

  return {
    statusCode: 200,
    body: 'search message received'
  };
};