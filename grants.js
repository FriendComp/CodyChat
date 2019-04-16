// Written by Maxfield Gordon & David Vasilia
// Last updated April 18, 2019

'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function recommend_start(agent) {
    const [status, gpa, residency, units] = [agent.parameters.status, agent.parameters.gpa, agent.parameters.residency, agent.parameters.units];
    let grants = [];
    let result = "";
    let resultPayload = [];
    let i = 0;

    //gpatype = typeof(gpa)
    //unitstype = typeof(units)
    agent.add(`Status is: ${status}`);
    agent.add(`gpa is: ${gpa}`);
    agent.add(`Residency is: ${residency}`);
    agent.add(`Units is: ${units}`);
    //agent.add(`gpa type is: ${gpatype}`);
    //agent.add(`Units type is: ${unitstype}`);

    if (status === `undergrad` || status === `grad`) {
      if (gpa >= 2.5) {
        grants.push(`BIAG`);
      }
    }

    if (status === `undergrad` || status === `credential`) {
      if (gpa >= 2.4) {
        if (residency === `resident`) {
          grants.push(`Cal A`);
        }
      }
    }

    if (status === `undergrad` || status === `credential`) {
      if (gpa >= 2.0) {
        if (residency === `resident`) {
          grants.push(`Cal B`);
        }
      }
    }

    if (status === `undergrad`) {
      if (gpa >= 2.0) {
        if (residency === `resident`) {
          grants.push(`Chafee`);
        }
      }
    }

    if (status === `undergrad`) {
      if (gpa >= 2.0) {
        if (residency === `resident`) {
          if (units >= 12) {
            grants.push(`CSU EOP`);
          }          
        }
      }
    }

    if (status === `undergrad`) {
      if (gpa >= 2.0) {
          grants.push(`Federal Pell`);
      }
    }

    if (status === `undergrad`) {
      if (gpa >= 2.0) {
          grants.push(`FSEOG`);
      }
    }

    if (status === `grad`) {
      if (gpa >= 2.0) {
        if (residency === `resident`) {
          if (units >= 6) {
            grants.push(`Graduate Business Grant`);            
          }
        }
      }
    }

    if (status === `undergrad` || status === `grad`) {
      if (residency === `resident`) {
        grants.push(`LEPD`);
      }
    }

    if (status === `undergrad` || status === `grad`) {
      if (residency === `resident`) {
        grants.push(`MCS`);
      }
    }

    if (status === `undergrad` || status === `grad`) {
      if (residency === `resident`) {
        grants.push(`CNG EAAP`);
      }
    }

    if (status === `undergrad` || status === `grad`) {
      if (gpa >= 2.2) {
        if (residency === `resident`) {
          grants.push(`NCAA Grants`);
        }
      }
    }

    if (status === `undergrad` || status === `grad` || status === `credential`) {
      if (gpa >= 2.2) {
        if (residency === `resident`) {
          grants.push(`SUG`);
        }
      }
    }

    for (i = 0; i < grants.length; i++) {
      result += grants[i] + ", ";

      if (i + 1 < grants.length) {
        resultPayload.push(
          {
            "title:": `${i}`,
            "message": `${i}`
          },);
      }
      else if (i + 1 === grants.length) {
        resultPayload.push(
          {
            "title:": `${i}`,
            "message": `${i}`
          });
      }      
    }

    agent.add(result);

    if (status && gpa && residency && units) {
      agent.add(new Payload("PLATFORM_UNSPECIFIED", [{                            
        "message": `Great, here's what I recommend for you:`,
    
        "platform": "kommunicate",
          "metadata": {
          "contentType": "300",
          "templateId": "6",
          "payload": resultPayload
          }
        }]
     ));
    }    
  }

  function recommend_next(agent) {
    reco = agent.context.get('reco');
    const [status, gpa, residency, units] = reco.parameters., reco[1], reco[2], reco[3]
  }
  
  function termStart(agent) {
    const [term, year] = [agent.parameters.term, agent.parameters.year];
    agent.add('Term is:', term, 'and year is:', year);

    let missingSlots = [];

    if (!term) { missingSlots.push('term'); }
    if (!year) { missingSlots.push('year'); }

    if (missingSlots.length === 1){
       agent.add(`Looks like you didn't provide a ${missingSlots[0]}`);
    }
    else if (missingSlots.length === 2){
       agent.add(`Ok, I need two more things, a ${missingSlots[0]} and ${missingSlots[1]}`);
    }
    if (term === 'fall'){
      if (year === '2019') {
        agent.add('The start date for Fall 2019 is September 2019.');
      }            
    }
    agent.add("the term is:", term, "and the year is:", year);
  }
  
  let intentMap = new Map();
  intentMap.set('recommend_start', recommend_start);
  intentMap.set('recommend_next', recommend_next);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('TermStart', termStart);
  agent.handleRequest(intentMap);
});
