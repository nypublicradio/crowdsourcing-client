import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  label:    faker.random.word,
  required: false,
  inputType: () => faker.random.arrayElement(['e', 'x', 't', 'a']),
  shortName: () => faker.helpers.slugify(faker.random.words(2)),
  questionText: faker.random.sentence
});
