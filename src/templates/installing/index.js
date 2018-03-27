'use strict';

const nodeVersions = require('node-version-data');
const deasync = require('deasync');

let latestLTS;
try {
  latestLTS = deasync(nodeVersions)().find(value => value.lts).version.replace(/^v/, '');
} catch (e) {
  latestLTS = '8.10.0';
}

const versions = {
  minimum: {
    mongo: '3.0',
    redis: '2.0',
    node: '6.0',
    npm: '3.0',
  },
  recommended: {
    mongo: '3.6',
    redis: '3.2',
    node: latestLTS,
    npm: '5.8.0',
    nginx: '1.12.2',
    nodebb: '1.8.x',
  },
};

versions.major = Object.keys(versions.recommended).reduce((prev, key) => {
  prev[key] = versions.recommended[key].split('.')[0];
  return prev;
}, {});

exports.versions = versions;
