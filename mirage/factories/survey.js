import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title:    () => `Survey: ${faker.random.words(3)}`,
  summary:  () => `Summary: ${faker.lorem.paragraph()}`,
  thankYou: () => faker.lorem.sentence(),
  startsAt: faker.date.recent,
  brandLogo: () => ({
    url: 'https://lorempixel.com/40/40/',
    height: 40,
    width: 40
  }),
  brandLink: faker.internet.url,
  brandLinkLabel: () => faker.lorem.word(1),
  expired: false
});
