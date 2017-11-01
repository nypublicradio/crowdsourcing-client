export function createAudioSurvey(server) {
  // required questions for dev testing
  let audio =     {shortName: 'audio', inputType: 'a'};
  let email =     {shortName: 'email', inputType: 'e', label: 'Email'};
  let lastName =  {shortName: 'last-name', inputType: 't', label: 'Last name'};
  let firstName = {shortName: 'first-name', inputType: 't', label: 'First name'};
  
  server.createList('survey', 10, {
    questions: [
      server.create('question', audio),
      server.create('question', firstName),
      server.create('question', lastName),
      server.create('question', email),
    ]
  });
}

export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  createAudioSurvey(server);
}
