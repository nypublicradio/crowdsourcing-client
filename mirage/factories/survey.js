import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title:    () => `Survey: ${faker.random.words(3)}`,
  summary:  () => `Summary: ${faker.lorem.paragraph()}`,
  thankYou: () => faker.lorem.sentence(),
  startsAt: faker.date.recent,
});
