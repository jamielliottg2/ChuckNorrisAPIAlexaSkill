var https = require('https');
const Alexa = require('ask-sdk');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Welcome to the Chuck Norris RESTFul API Test Skill in the Alexa SDK V2 from Jamie's Dev Shed. What would you like?")
      .reprompt("What would you like?")
      .getResponse();
  },
};

const GetJokeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetJokeIntent';
  },
  async handle(handlerInput) {
    const response = await httpGet();
    
    console.log(response);

    return handlerInput.responseBuilder
            .speak("Okay. Here is what I got back from my request. " + response.value.joke)
            .reprompt("What would you like?")
            .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetJokeHandler
  )
  .lambda();

function httpGet() {
  return new Promise(((resolve, reject) => {
    var options = {
        host: 'api.icndb.com',
        port: 443,
        path: '/jokes/random',
        method: 'GET',
    };
    
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}