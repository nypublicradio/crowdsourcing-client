/* eslint-env node */
const FastBootAppServer = require('fastboot-app-server');
const S3Downloader = require('fastboot-s3-downloader');
const S3Notifier = require('fastboot-s3-notifier');

require('dotenv').config();


let downloader = new S3Downloader({
  bucket: process.env.AWS_BUCKET,
  key: process.env.FASTBOOT_MANIFEST,
});

let notifier = new S3Notifier({
  bucket: process.env.AWS_BUCKET,
  key: process.env.FASTBOOT_MANIFEST,
});

let server = new FastBootAppServer({
  downloader,
  notifier,
  gzip: true, // Optional - Enables gzip compression.
  // host: '0.0.0.0', // Optional - Sets the host the server listens on.
  // port: 4000, // Optional - Sets the port the server listens on (defaults to the PORT env var or 3000).
  chunkedResponse: true // Optional - Opt-in to chunked transfer encoding, transferring the head, body and potential shoeboxes in separate chunks. Chunked transfer encoding should have a positive effect in particular when the app transfers a lot of data in the shoebox.
});

server.start();
