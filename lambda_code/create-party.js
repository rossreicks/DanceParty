exports.handler = async event => {
    console.log(JSON.stringify(event))

    const req = JSON.parse(event.body);
    const id = req.partyId;
    const emailAddress = req.email;
    const partyName = req.partyName;

    return {
        statusCode: 200,
        body: 'create party message received'
    };
};