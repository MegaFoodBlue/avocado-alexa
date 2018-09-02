/* jshint node: true */
'use strict';

const rich = require('../lib/rich-responses');
const https = require('https');
const secret = require('../lib/secret');
const Airtable = require('airtable');

const footer = 'This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.';

exports.goalsAlexa = (goal, index)=>{
       return new Promise((resolve, reject)=>{
              let data = {};
              airtableGetGoals(goal).then(records =>{
                     data = records;
                     console.log(JSON.stringify(records,null,2));
                     let simpleResponse = data.richResponse.items[0].simpleResponse.textToSpeech;
                     let products = data.richResponse.items[1].carouselBrowse.items;
                     let length = products.length;
                     console.log('build single response is running with length of products ----->' + length + 'and index--->' + index);
                     if(index === 0){
                            let product = products[index];
                            console.log('case 2' + JSON.stringify(product));
                            resolve(simpleResponse + '<break time=\'.5s\'/> ' + product.description + '.<break time=\'.5s\'/> You can say next to hear more.  Or say goodbye to close our conversation.' );
                     } else if(index < length){
                            console.log('case 3 ---->'+length + index);
                            let product = products[index];
                            console.log(JSON.stringify(product));
                            resolve(product.description + '. You can say next to hear more...  Or say goodbye to close our conversation.');
                     } else if(index === length){
                            console.log('case 4 ----> last product');
                            let product = products[index];
                            console.log(JSON.stringify(product));
                            resolve('This was the last product on this category. You can say previous to go back');
                     }
                     else {
                            console.log('case 5');
                            //resolve(conv);
                     }
              })
                     .catch((err =>{
                            console.error(err);
                            throw new Error(err);
                     }));
       });
};

exports.randomCFI = () => {
       let questions = ['What are your health goals?', 'we can start by telling me your age and gender?', 'What are your wanting to upgrade with your health?'];
       let random = getRandom(0, questions.length-1);
       return "<break time='.5s'/>" + questions[random];
};

exports.randomWelcome = ()=>{
       let questions = ['What are your health goals?', 'Help me, help you by telling me your age and gender?', 'How can I help you?', 'What are your wanting to upgrade with your health?', 'You can ask me for information on all of Megafood\'s products'];
       let random = getRandom(0, questions.length-1);
       return "<break time='.5s'/>" + questions[random];

};

exports.getRandomGoodbye = () => {
       let goodbyes = ['Thank you for talking to us!', 'Keep it Real!', 'Goodbye'];
       let random = getRandom(0, goodbyes.length-1);
       return "<break time='.5s'/>" + goodbyes[random];
};

exports.getSpokenValue = (envelope, slotName) => {
              if (envelope &&
                     envelope.request &&
                     envelope.request.intent &&
                     envelope.request.intent.slots &&
                     envelope.request.intent.slots[slotName] &&
                     envelope.request.intent.slots[slotName].value)
              {
                     return envelope.request.intent.slots[slotName].value;
              }
              else {
                     return undefined;
              }
       };

exports.getResolvedValues = (envelope, slotName) => {
              if (envelope &&
                     envelope.request &&
                     envelope.request.intent &&
                     envelope.request.intent.slots &&
                     envelope.request.intent.slots[slotName] &&
                     envelope.request.intent.slots[slotName].resolutions &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values)
              {
                     return envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.name;
              }
              else {
                     return undefined;
              }
       };

exports.getSlotValues = (filledSlots) => {
       const slotValues = {};

       console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
       Object.keys(filledSlots).forEach((item) => {
              const name = filledSlots[item].name;
              if (filledSlots[item] &&
                     filledSlots[item].resolutions &&
                     filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
                     filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
                     filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                     switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                            case 'ER_SUCCESS_MATCH':
                                   slotValues[name] = {
                                          synonym: filledSlots[item].value,
                                          value: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                                          id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
                                          isValidated: true
                                   };
                                   break;
                            case 'ER_SUCCESS_NO_MATCH':
                                   slotValues[name] = {
                                          synonym: filledSlots[item].value,
                                          value: filledSlots[item].value,
                                          id: null,
                                          isValidated: false,
                                   };
                                   break;
                            default:
                                   break;
                     }
              } else {
                     slotValues[name] = {
                            synonym: filledSlots[item].value,
                            value: filledSlots[item].value,
                            id: filledSlots[item].id,
                            isValidated: false
                     };
              }
       }, this);

       return slotValues;
};

function getRandom(min, max) {
       return Math.floor(Math.random() * (max-min+1)+min);
}

exports.airtableGet = (base, table, filter, callback)=> {
       console.log("IN AIRTABLE GET");
       console.log("BASE = " + base);
       console.log("TABLE = " + table);
       console.log("FILTER = " + filter);

       let options = {
              host: "api.airtable.com",
              port: 443,
              path: "/v0/" + base + "/" + table + "?api_key="+secret.AIRTABLE_API_KEY + filter,
              method: 'GET',
       };

       console.log("PATH = https://" + options.host + options.path);

       let req = https.request(options, res => {
              res.setEncoding('utf8');
              let returnData = "";

              res.on('data', chunk => {
                     returnData = returnData + chunk;
              });

              res.on('end', () => {
                     let data = JSON.parse(returnData);
                     console.log("DATA = " + JSON.stringify(data));
                     callback(data);
              });
       });
       req.end();
};

exports.getValuesString = (values) => {
       var string = "";
       for (var i = 0;i<values.length; i++)
       {
              if (i != 0) string += ", ";
              if (i === (values.length-1)) string += " or ";
              string += values[i].value.name;
       }

       let sanitized = string.replace(/&/gi,'and');
       return sanitized;
}

function airtableGetGoals (goal){
       const base = new Airtable({apiKey: secret.AIRTABLE_API_KEY}).base('apparAnxxgPKNtgws');
       let items = [];
       let payload = {
              "richResponse" :{
                     "items" : [
                            {
                                   "simpleResponse": {
                                   }
                            },
                            {
                                   "carouselBrowse" : {
                                          "items" : [{}]
                                   }
                            }
                     ]
              }
       };
       return new Promise((resolve,reject)=>{
              console.log('getting products for : ' + goal);
              base(goal).select({
                     maxRecords: 10,
                     view: "Grid view"
              }).eachPage(function page(records) {
                     records.forEach(function(record) {
                            if(record.get('title')=== 'General' ){
                                   payload.richResponse.items[0].simpleResponse.textToSpeech = record.get('description');
                            } else {
                                   let description = '';
                                   if (record.get('spoken description')){
                                          description = record.get('spoken description');
                                   } else {
                                          description = record.get('description');
                                   }
                                   let item = {
                                          "title" : record.get('title'),
                                          "description": description,
                                          "footer": footer,
                                          "image" : {
                                                 "url" : record.get('image'),
                                                 "accessibilityText" : record.get('title')
                                          },
                                          "openUrlAction" : {
                                                 "url" : record.get('openUrlAction')
                                          }
                                   };
                                   items.push(item);
                            }
                     });
                     payload.richResponse.items[1].carouselBrowse.items = items;
                     resolve(payload);
                     console.log("This is the payload processed by airtableGetGoals ----->"+JSON.stringify(payload, null, 2));
              }, function done(err) {
                     if (err) {console.error(err);}
                     reject(err);
              });
       });
}
