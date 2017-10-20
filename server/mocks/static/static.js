/* eslint-env node */
'use strict';
const express = require('express');

module.exports = function(app) {
  app.use('/static', express.static(__dirname));
};
