/* eslint-env node */
'use strict';
const script = require('./script');

module.exports = {
  name: 'new-relic',

  isDevelopingAddon() {
    return true;
  },
  
  contentFor(type, config) {
    if (type === 'head' && config.environment === 'production') {
      let textContent = script.scriptContent(process.env.NEW_RELIC_APP_ID).split('\n').join('');
      return `<script type="text/javascript">${textContent}</script>`;
    }
  }
};
