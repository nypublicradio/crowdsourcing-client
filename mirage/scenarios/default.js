export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  // required questions for dev testing
  let firstName = server.create('question', {shortName: 'first-name', type: 't'});
  let lastName = server.create('question', {shortName: 'last-name', type: 't'});
  let email = server.create('question', {shortName: 'email', type: 'e'});
  let audio = server.create('question', {shortName: 'audio', type: 'a'});
  server.createList('survey', 10, {
    questions: [firstName, lastName, email, audio]
  });
}
