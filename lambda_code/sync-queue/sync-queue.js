const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION
});

exports.handler = async event => {
    const queryParams = {
        TableName: process.env.PARTY_TABLE_NAME,
        Key: {
            partyId: JSON.parse(event.body).partyId
        }
    };
    let party = await ddb.get(queryParams).promise();
    if (party && party.Item) {
        party = party.Item;
        party.queue = JSON.parse(event.body).queue;

        const putParams = {
            TableName: process.env.PARTY_TABLE_NAME,
            Item: party
        };

        await ddb.put(putParams).promise();
    }

    return {
        statusCode: 200,
        body: 'party queue sync message received'
    };
}