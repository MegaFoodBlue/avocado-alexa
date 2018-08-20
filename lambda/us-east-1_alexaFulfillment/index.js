
/* jshint node: true */

'use strict';

const Alexa = require('ask-sdk');
const APP_ID = 'amzn1.ask.skill.2580776c-62c3-4997-8724-178807458af1';
const build = require('./lib/build-responses');


const RequestLog = {
       process(handlerInput){
              console.log("REQUEST ENVELOPE V2= "+ JSON.stringify(handlerInput.requestEnvelope));
              return;
       }
};

const ResponseLog = {
       process(){

       }
}

const LaunchRequestHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "LaunchRequest";
       },

       handle(handlerInput, error){
              console.log("IN LAUNCH REQUEST");
              return handlerInput.responseBuilder
                     .speak("Hi! I\'m not a substitute for a medical professional, but I know a lot about health and wellness.  " + build.randomWelcome())
                     .reprompt(build.randomWelcome())
                     .getResponse();
       },
};

const ErrorHandler = {
       canHandle(){
              return true;
       },
       handle(handlerInput, error){
              console.log("Error Handled: "+ JSON.stringify(error.message));
              console.log("handlerInput: "+ JSON.stringify(handlerInput));
              return handlerInput.responseBuilder
                     .speak("Sorry, I didn't get that.")
                     .reprompt(build.randomWelcome())
                     .getResponse();
       },
};

const HelpHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
       },
       handle(handlerInput, error) {
              console.log("IN " + handlerInput.requestEnvelope.request.intent.name.toUpperCase())
              return handlerInput.responseBuilder
                     .speak(build.randomWelcome())
                     .reprompt(build.randomWelcome())
                     .getResponse();
       }
};

const StopHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     (handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent" ||
                            handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent");
       },
       handle(handlerInput, error) {
              console.log("IN " + handlerInput.requestEnvelope.request.intent.name.toUpperCase());
              return handlerInput.responseBuilder
                     .speak(build.getRandomGoodbye())
                     .getResponse();
       }
};

const SessionEndedHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
       },
       handle(handlerInput) {
              console.log("IN SESSIONENDEDHANDLER");
              return handlerInput.responseBuilder
                     .speak(build.getRandomGoodbye())
                     .getResponse();
       }
};

const NextHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Next";
       },
       async handle (handlerInput){
              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();
              let wellnessGoal =  attributes.wellnessGoal;
              console.log('IN NEXT HANDLER v2 ---------------------------------------- for : '+ wellnessGoal);
              if(wellnessGoal === undefined){
                     speech = 'What are your wellness goals?'
              } else if (wellnessGoal){
                     let index = attributes.index;
                     index ++;
                     attributes.index = index;
                     console.log('getting product in index: '+ index);
                     await build.goalsAlexa(wellnessGoal, index)
                            .then(value =>{
                                   speech = value;
                            })
              }
              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const PreviousHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Previous";
       },
       async handle (handlerInput){
              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();
              let wellnessGoal =  attributes.wellnessGoal;
              console.log('IN Previous HANDLER v2 ---------------------------------------- for : '+ wellnessGoal);
              if(wellnessGoal === undefined){
                     speech = 'What are your wellness goals?'
              } else if (wellnessGoal){
                     let index = attributes.index;
                     index --;
                     attributes.index = index;
                     console.log('getting product in index: '+ index);
                     await build.goalsAlexa(wellnessGoal, index)
                            .then(value =>{
                                   speech = value;
                            })
              }
              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const BeautySkinHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "BeautySkin";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "BeautySkin";
              attributes.index = 0;

              console.log('IN BEAUTY SKIN HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('BeautySkin', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const PrenatalPostnatalHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "PrenatalPostnatal";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "PrenatalPostnatal";
              attributes.index = 0;

              console.log('IN  PRENATAL POSTNATAL HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('PrenatalPostnatal', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const BoneHealthHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "BoneHealth";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "BoneHealth";
              attributes.index = 0;

              console.log('IN BONEHEALTH HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('BoneHealth', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const SleepStressHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "SleepStress";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "SleepStress";
              attributes.index = 0;

              console.log('IN SLEEPSTRESS HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('SleepStress', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const ImmuneHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Immune";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "Immune";
              attributes.index = 0;

              console.log('IN IMMUNE HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('Immune', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const SportHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Sport";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "Sport";
              attributes.index = 0;

              console.log('IN Sport HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('Sport', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const DigestiveHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Digestive";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "Digestive";
              attributes.index = 0;

              console.log('IN Digestive HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('Digestive', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const EnergyHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "Energy";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "Energy";
              attributes.index = 0;

              console.log('IN Energy HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('Energy', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const KidsHealthHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "KidsHealth";
       },
       async handle(handlerInput, error) {

              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = "KidsHealth";
              attributes.index = 0;

              console.log('IN Energy HANDLER v2 ----------------------------------------');

              await build.goalsAlexa('KidsHealth', 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};


const DefaultSupplementsHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "DefaultSupplements";
       },
       handle(handlerInput, error) {

              let speech = build.randomWelcome();
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              attributes.wellnessGoal = undefined;
              attributes.index = 0;

              console.log('IN DefaultSupplementsHandler v2 ----------------------------------------');

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt(speech)
                     .getResponse();
       }
};

const HealthyAgingHandler = {
       canHandle(handlerInput){
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "HealthyAging";
       },
       async handle(handlerInput, error) {
              console.log('IN HealthyAging HANDLER v2 ----------------------------------------');
              let speech = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();
              let age = build.getSpokenValue(handlerInput.requestEnvelope, "Age");
              let gender = build.getResolvedValues(handlerInput.requestEnvelope, "Gender");

              let params = {
                'user-gender' : gender,
                'Age' : age
              };

              attributes.wellnessGoal = "HealthyAging";
              attributes.index = 0;


              await build.goalsAlexa('HealthyAging', 0, params)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     });

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

exports.handler = Alexa.SkillBuilders.custom()
       .addRequestHandlers(
              LaunchRequestHandler,
              NextHandler,
              PreviousHandler,
              BeautySkinHandler,
              PrenatalPostnatalHandler,
              BoneHealthHandler,
              SleepStressHandler,
              ImmuneHandler,
              SportHandler,
              DigestiveHandler,
              EnergyHandler,
              KidsHealthHandler,
              DefaultSupplementsHandler,
              HealthyAgingHandler,
              HelpHandler,
              StopHandler,
              SessionEndedHandler
       )
       .addRequestInterceptors(RequestLog)
       .addErrorHandlers(ErrorHandler)
       .lambda();