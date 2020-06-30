const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION
});

exports.handler = async event => {

    const updateConnectionObject = async (connectionId, partyId) => {
        const queryParams = {
            TableName: process.env.CONNECTION_TABLE_NAME,
            Key: {
                connectionId
            }
        };
        let connection = await ddb.get(queryParams).promise();
        if (connection && connection.Item) {
            connection = connection.Item;
        }
        connection.partyId = partyId;

        const putParams = {
            TableName: process.env.CONNECTION_TABLE_NAME,
            Item: connection
        };

        await ddb.put(putParams).promise();
    }

    const updatePartyObject = async (connectionId, partyId) => {
        const queryParams = {
            TableName: process.env.PARTY_TABLE_NAME,
            Key: {
                partyId
            }
        };
        let party = await ddb.get(queryParams).promise();
        if (party && party.Item) {
            party = party.Item;
            party.owner.connectionId = connectionId;
        } else {
            party = {
                partyId,
                owner: {
                    connectionId
                },
                queue: []
            }
        }

        const putParams = {
            TableName: process.env.PARTY_TABLE_NAME,
            Item: party
        };

        await ddb.put(putParams).promise();
    }

    try {
        const connectionId = event.requestContext.connectionId;
        const partyId = JSON.parse(event.body).partyId;

        await updateConnectionObject(connectionId, partyId);
        await updatePartyObject(connectionId, partyId);
    } catch (err) {
        return {
            statusCode: 500,
            body: 'Failed to create party: ' + JSON.stringify(err)
        };
    }

    return {
        statusCode: 200,
        body: 'create party message received'
    };
};