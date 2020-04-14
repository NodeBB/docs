'use strict';

const nodeVersions = require('node-version-data');
const deasync = require('deasync');

let latestLTS;
try {
  latestLTS = deasync(nodeVersions)().find(value => value.lts).version.replace(/^v/, '');
} catch (e) {
  latestLTS = '10.0';
}

const versions = {
  minimum: {
    mongo: '3.0',
    redis: '2.0',
    node: '8.0',
    npm: '3.0',
  },
  recommended: {
    mongo: '4.0',
    redis: '4.0.9',
    node: latestLTS,
    npm: '6.4',
    nodebb: '1.13.x',
  },
};

versions.major = Object.keys(versions.recommended).reduce((prev, key) => {
  prev[key] = versions.recommended[key].split('.')[0];
  return prev;
}, {});

exports.versions = versions;
