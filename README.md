# Dance Party

Goals:
Set up github actions for CI/CD
Use exclusivly cloud formation to build resources
attempt to make the entire thing "serverless"

Ideas:
2 main states: party owner and guest

s3 bucket to store web content
cloudfront to distribute the content
dynomo to store application state
lambda to facilitate requests