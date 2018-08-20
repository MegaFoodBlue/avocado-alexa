/* jshint node: true */
'use strict';

const rich = require('../lib/rich-responses');


exports.goalsAlexa = (goal, index, params)=>{
       return new Promise((resolve, reject)=>{
              if(!params){
                     params = {};
              }
              let data = rich.getResponses(goal, params);
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
       });
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

exports.getSpokenValue = (envelope, slotName) =>
       {
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

exports.getResolvedValues = (envelope, slotName) =>
       {
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
                     return envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values;
              }
              else {
                     return undefined;
              }
       };

function getRandom(min, max) {
       return Math.floor(Math.random() * (max-min+1)+min);
}

