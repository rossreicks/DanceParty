exports.handler = async event => {
    console.log(JSON.stringify(event))
    return { statusCode: 200, body: 'create party message received' };
};