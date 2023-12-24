'use strict';

const versions = {
  minimum: {
    mongo: '3.2',
    redis: '2.6.12',
    node: '14.0',
    npm: '6.9',
  },
  recommended: {
    mongo: '5.0',
    redis: '6.2.6',
    node: 'lts',
    npm: '10.2.3',
    nodebb: '3.x',
  },
};

versions.major = Object.keys(versions.recommended).reduce((prev, key) => {
  prev[key] = versions.recommended[key].split('.')[0];
  return prev;
}, {});

exports.versions = versions;
