
/* jshint node: true */

/* eslint-disable  func-names */
/* eslint-disable  no-console */
/*jshint esversion: 6 */

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
                     .speak('  There’s a lot to love about Megafood\'s vitamins and supplements.' +
                            '  Easy-to-digest and formulated with farm fresh ingredients, they deliver optimal nutrition and support an overall sense of wellbeing.'+
                            '  In order for me to help you find the right one, please tell me what you want to achieve.<break time="300ms"/>' +
                            '  Want to loose weight?' + '  Or have more energy?' +
                            '  Or provide proper nourishment to you and your loved ones?\n<break time="700ms"/>' +
                            '  Let me know what you want and I can point you to the right supplements.')
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
       async handle(handlerInput, error) {

              let attributes = handlerInput.attributesManager.getSessionAttributes();
              const intentName = handlerInput.requestEnvelope.request.intent.name;
              const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
              const slotValues = build.getSlotValues(filledSlots);
              const wellnessgoals = build.getResolvedValues(handlerInput.requestEnvelope, "welllnessgoals");

              console.log('getting goals for: ' +wellnessgoals);

              let speech = "";

              attributes.wellnessGoal = wellnessgoals;
              attributes.index = 0;

              console.log('IN DefaultSupplementsHandler v2 ---------------------------------------- '+ JSON.stringify(slotValues));

              if(wellnessgoals === undefined){
                     speech="What are your wellness goals?"
              } else {
                     await build.goalsAlexa(wellnessgoals,0)
                            .then(value => {
                                   console.log(value);
                                   speech = value;
                            });
              }

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();

              /*if (slotValues.wellnessgoals.isValidated) {
                     console.log ("in DefaultSupplements AboutIntentHandler YES");
                     return handlerInput.responseBuilder
                            .withCanFulfillIntent(
                                   {
                                          "canFulfill": "YES",
                                          "slots":{
                                                 "wellnessgoals": {
                                                        "canUnderstand": "YES",
                                                        "canFulfill": "YES"
                                                 }
                                          }
                                   })
                            .getResponse();
              } else {
                     console.log ("in CFIR AboutIntentHandler canFulfill == NO");
                     return handlerInput.responseBuilder
                            .withCanFulfillIntent(
                                   {
                                          "canFulfill": "YES",
                                          "slots":{
                                                 "wellnessgoals": {
                                                        "canUnderstand": "YES",
                                                        "canFulfill": "NO"
                                                 }
                                          }
                                   })
                            .getResponse();
              }

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt(speech)
                     .getResponse();*/
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
              let goal = "";
              let attributes = handlerInput.attributesManager.getSessionAttributes();

              await new Promise(resolve => {
                     let age = build.getSpokenValue(handlerInput.requestEnvelope, "Age");
                     let gender = build.getResolvedValues(handlerInput.requestEnvelope, "Gender");
                     if(age< 40 && gender === 'male'){
                            goal = "MensHealth";
                            resolve();
                     }
                     if(age >= 40 && age < 55  && gender === 'male'){
                            goal = "HealthyAgingMen40";
                            resolve();
                     }
                     if(age >= 55 && gender === 'male'){
                            goal = "HealthyAgingMen55";
                            resolve();
                     }
                     if(age < 40 && gender === 'female'){
                            goal = "WomensHealth";
                            resolve();
                     }
                     if(age >= 40 && age < 55  && gender === 'female'){
                            goal = "HealthyAgingWomen40";
                            resolve();
                     }
                     if(age >= 55 && gender === 'female'){
                            goal = "HealthyAgingWomen55";
                            resolve();
                     }

              });

              attributes.wellnessGoal = goal;
              attributes.index = 0;



              await build.goalsAlexa(goal, 0)
                     .then(value => {
                            console.log(value);
                            speech = value;
                     })
                     .catch((err =>{
                            console.error(err);
                            throw new Error(err);
                     }));

              return handlerInput.responseBuilder
                     .speak(speech)
                     .reprompt('You can say next to hear more...  Or say goodbye to close our conversation.')
                     .getResponse();
       }
};

const ProductInfoHandler = {
       canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                     handlerInput.requestEnvelope.request.intent.name === "ProductInfo";
       },
       handle(handlerInput, error) {

              console.log("IN ProductInfo HANDLER");

              let attributes = handlerInput.attributesManager.getSessionAttributes();
              let infoRequired = '';
              let infoString = "";

              const spokenValue = build.getSpokenValue(handlerInput.requestEnvelope, "product");
              const resolvedValues = build.getResolvedValues(handlerInput.requestEnvelope, "product");
              const productInfo = build.getResolvedValues(handlerInput.requestEnvelope, "Info");

              console.log(productInfo[0].value.name + '<--------- Product Info asked for.');
              //NO MATCHES FOUND
              if (resolvedValues === undefined)
              {
                     return handlerInput.responseBuilder
                            .speak("I wasn't able to find a match for " + spokenValue + ". " + build.randomWelcome())
                            .reprompt("I wasn't able to find a match for " + spokenValue + ". " + build.randomWelcome())
                            .getResponse();
              }
              //ONLY ONE MATCH FOUND
              else if (resolvedValues)
              {
                     const filter = "&filterByFormula=%7BProduct%20Name%7D%3D%22" + encodeURIComponent(resolvedValues[0].value.name) + "%22";

                     return new Promise((resolve) => {
                            build.airtableGet("apparAnxxgPKNtgws", "Master%20Products", filter, (record) => {
                                   console.log("AIRTABLE RECORD = " + JSON.stringify(record));

                                   if(attributes.disambiguation){
                                          attributes.disambiguation = false;
                                          infoRequired = attributes.infoRequired
                                   } else if (!attributes.disambiguation){
                                          infoRequired = productInfo[0].value.name;
                                          attributes.infoRequired = infoRequired;
                                          infoString = record.records[0].fields[infoRequired];
                                   }
                                   let sanitized = infoString.replace(/&/gi,'and');

                                   console.log(sanitized);
                                   let speechText = "The " + infoRequired + " for " + spokenValue + " is:  <break time='.5s'/>" + sanitized + build.randomWelcome();

                                   console.log("RESPONSE BUILDER = " + JSON.stringify(handlerInput.responseBuilder));

                                   resolve(handlerInput.responseBuilder
                                          .speak(speechText)
                                          .reprompt(build.randomWelcome())
                                          .getResponse());
                            });
                     });
              }
              //MORE THAN ONE MATCH FOUND.  DISAMBIGUATE.
              /*else if (resolvedValues.length > 1)
              {
                     let valuesString = build.getValuesString(resolvedValues);
                     console.log('Sanitized string: ----->'+valuesString);

                     attributes.disambiguation = true;
                     infoRequired = productInfo[0].value.name;
                     attributes.infoRequired = infoRequired;

                     return handlerInput.responseBuilder
                            .speak("You asked me about " + spokenValue + ", and I found multiple answers.  Would you like to know about: " + valuesString + "?")
                            .reprompt("Would you like to know about: " + valuesString + "?")
                            .getResponse();
              }*/
       }
}



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
              ProductInfoHandler,
              HelpHandler,
              StopHandler,
              SessionEndedHandler
       )
       .addRequestInterceptors(RequestLog)
       .addErrorHandlers(ErrorHandler)
       .lambda();