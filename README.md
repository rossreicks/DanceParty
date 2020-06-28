# Dance Party
A dance party dj allowing guests to queue songs like a jukebox

## Goals of project:
* Set up github actions for CI/CD
* Use exclusivly cloud formation to build resources
* attempt to make the entire thing "serverless"
* utilize spotify api

## Idea:
2 main states: 
    * party owner
    * guest

## Infra
* s3 bucket to store web content
* cloudfront to distribute the content
* dynomo to store application state
* lambda to facilitate requests (queue songs, play next song, etc)
* sqs? to hold the queue?