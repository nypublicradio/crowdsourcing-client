# crowdsourcing-client

This app is designed to work with NYPR's [crowdsourcing microservice](https://github.com/nypublicradio/crowdsourcing). It provides a UI to display surveys and save user input in coordination with the microservice.

## Data Models
This client manages a small set of models to represent the data provided by the crowdsourcing microservice.

### `survey`
The `survey` model represents some metadata (provided as primitive values) about a collection of `question` models (represented as a `hasMany` relationship on the client). The crowdsourcing microservice provides surveys via `id` lookup, which the client manages via `ember-data` using the application adapter and ember conventions.

```js
title:            DS.attr('string')
summary:          DS.attr('string')
thankYou:         DS.attr('string')
startsAt:         DS.attr('string')
questions:        DS.hasMany('question')
```

Also, the client adds some computed properties:
```js
audioQuestions:   filterBy('questions', 'inputType', 'a')
hasAudioQuestion: bool('audioQuestions.length')
```

### `question`
The `question` model represents a prompt for user input. The crowdsourcing microservice handles validations, but offers some hints to the client in the form of `required` and `inputType` attributes, which the client uses to perform some basic validation.

The set of `inputType` values is finite, and exported from the model definition for use in other parts of the app:
```js
const TEXT     = 't';
const EMAIL    = 'e';
const AUDIO    = 'a'
const TEXTAREA = 'x';

export const TYPES = {
  TEXT,
  EMAIL,
  AUDIO,
  TEXTAREA,
};
```

Question model:
```js
label:        DS.attr('string'),
required:     DS.attr('boolean'),
inputType:    DS.attr('string'),
shortName:    DS.attr('string'),
questionText: DS.attr('string'),
```

The `shortName` attribute is used in the app to reference questions in a human readable way, most notably in the `personal-info` component, explained below.

### `submission`
The `submission` model represents a user response, tied to a particular `survey` via `belongsTo` relationship. The `answers` attribute is locally set as an object when it's created, and transformed by the submission serializer into the array of objects as expected by the microservice when it's saved out.

Submission model:
```js
survey:  DS.belongsTo('survey'),
answers: DS.attr({ defaultValue: () => ({}) })
```

The crowdsourcing microservice expects the `answers` attribute to be an array of objects in the following format:
```js
{
  question: <question id>,
  response: <response string>
}
```

## Components
The client relies heavily on components to manage the interface. The big idea is that the client can run different survey "types", each of which has a corresponding "manager". A survey manager expects a `step` value, a `survey` model and a `submission` model. The survey manager decides which UI component to render based on the value of the current step.

### `audio-survey-manager`
The `audio-survey-manager` presents a single survey which expects an audio response. Its critical role, beyond showing the correct UI component based on the current step, is to add the URL of the user's processed audio response to the outgoing submission model when the user completes the survey in its `finish` method. The handler will also execute a given `submission`'s save method.

It also supplies a `next` action to child components, which call it when the user indicates they are ready to move on. The child components pass values that the survey manager caches at a key of its own determination; the child components have no direct knowledge of what the the parent component is doing with the provided value.

### `action-button`
A basic UI component with no default behavior. Its `click` attribute is expected to be defined in its template context. Yields an unaltered block.

### `audio-recorder`
The `audio-recorder` component presents a UI for a given `question` model. It uses the `twilio` service to capture audio and passes up the completed connection to the provided `next` function.

Uses the `twilio-connected` event to manage the `disabled` attribute of the record button. Twilio will not save a recording that is shorter than 1s; the event handler keeps the button disabled until a timer has elapsed.

### `personal-info`
The `personal-info` component renders an input field for each question in a given set of `question` models, but only if the question's `shortName` attribute matches `first-name`, `last-name`, or `email`. Personal info only!

The component will create a changeset to manage validations for user inputs. The validations are defined in `app/validations/submission` and applied against the `answers` attribute of a given `submission` model. A question may specify itself as required, which will be enforced by the validations. Other validations are also possible, such as pattern matching for email inputs.

When the form is submitted, if the changeset is valid the changes are executed against the `submission.answers` attribute and an `onSubmit` attribute is invoked, if supplied.

### `playback-screen`
Polls the crowdsourcing microservice's status endpoint for a given `callId`. If the audio is not available after 10 attempts, the component bails on the interval and shows an error message.

Otherwise, when it receives an audio url it provides playback functionality via `ember-hifi`.

### `step-zero`
Renders introductory UI for a given audio survey. Provides a button to route to first survey step.

## Services

### `twilio`
The main service is the `twilio` service. It wraps the Twilio JS SDK and provides methods to initiate a connection via the twilio microservice, which will record audio from an input and save it to a remote server for processing and pick up from the twilio microservice.

Much of these details are abstracted away from the point of view of this app, which only needs to call the `record` and `disconnect` methods to initiate and save a piece of audio out, respectively. The `record` method is an `ember-concurrency` task, which returns a promise that resolves with a Twilio connection object. The `parameters.CallSid` value can be passed to the `audio-playback` component as the `callId` parameter (note the slight difference in naming convention there), which will handle retrieving a playable audio URL.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:nypublicradio/crowdsourcing-client`
* `cd crowdsourcing-client`
* `npm install`

## Running / Development

#### environment variables
This app uses `ember-cli-dotenv` to manage environment variables. To get started do:
```sh
$ cp .env.sample .env
```

And then fill in values for the following keys, as defined in the resulting `.env` file.

- `CROWDSOURCING_SERVICE`: full address to the crowdsourcing microservice backend
- `TWILIO_SERVICE`: full addresss to the NYPR twilio microservice backend, used to retrieve a signed auth token as required by the Twilio SDK.
- `TWLIO_NUMBER`: phone number of the crowdsourcing microservice's Twilio app

### run the app
* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying
The ember app is built, tested, and deployed using CircleCI as configured in the `circle.yml` file in this repo's root. The `demo` branch deploys to our demo infrastructure on every commit that passes the test suite and any tag that follows semver (`v\d+\.\d+\.\d+`) will deploy to the production infrastructure.

Because this app is deployed using `ember-cli-deploy` and associated plugins, you can also deploy the app from your local machine if you have the correct AWS permissions and environment variables set.

You can use the sample deploy env file to set deploy-time environment variables. The file is named according to the deploy target, so if you wanted to deploy to demo, you would do:
```sh
$ cp .env.deploy.sample .env.deploy.demo
```

And once you've filled in the values in `.env.deploy.demo`, you can run this to deploy to our demo infrastructure:
```sh
$ ember deploy demo
```

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
