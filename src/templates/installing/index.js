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
    mongo: '3.2',
    redis: '2.6.12',
    node: '12.0',
    npm: '6.9',
  },
  recommended: {
    mongo: '5.0',
    redis: '6.2.6',
    node: latestLTS,
    npm: '6.14',
    nodebb: '1.19.x',
  },
};

versions.major = Object.keys(versions.recommended).reduce((prev, key) => {
  prev[key] = versions.recommended[key].split('.')[0];
  return prev;
}, {});

exports.versions = versions;
