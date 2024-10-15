'use strict';

const versions = {
  minimum: {
    mongo: '3.2',
    redis: '2.6.12',
    node: '18.0',
    npm: '8.6.0',
  },
  recommended: {
    mongo: '8.0',
    redis: '6.2.6',
    node: '22.x',
    npm: '10.8.2',
    nodebb: '3.x',
  },
};

versions.major = Object.keys(versions.recommended).reduce((prev, key) => {
  prev[key] = versions.recommended[key].split('.')[0];
  return prev;
}, {});

exports.versions = versions;
