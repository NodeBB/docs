'use strict';

const fs = require('fs');
const path = require('path');
const klaw = require('klaw-sync');
const mkdirp = require('mkdirp').sync;

const cache = {};

function get(obj, path) {
  path = path.split('.');

  for (let i = 0; (i < path.length) && obj; i += 1) {
    const key = path[i];
    obj = obj[key];
  }

  return obj || 'NOT FOUND';
}

function set(obj, path, value) {
  path = path.split(/[\/\\]/);

  const lastKey = path.pop();

  for (let i = 0; i < path.length; i += 1) {
    const key = path[i];
    obj = obj[key] = obj[key] || {};
  }

  obj[lastKey] = value;
}

const pattern = /{{([^}]*)}}/g;
function parse(template, data) {
  const output = template.replace(pattern, (whole, identifier) => get(data, identifier));
  return pattern.test(output) ? parse(output, data) : output;
}

// basePath is something like 'installing/os/ubuntu'
function prepareData(basePath) {
  const base = path.join(__dirname, 'templates', basePath);

  const files = klaw(base, {
    nodir: true,
  });

  const data = {};
  files.forEach(file => {
    const p = path.relative(base, file.path.replace(/\..*$/, ''));
    const val = fs.readFileSync(file.path, 'utf8');

    set(data, p, val);
  });

  const directories = path.resolve(base).split(path.sep);

  const indexData = directories.reduce((prev, dir, i) => {
    try {
      const p = path.join(...directories.slice(0, i + 1));
      const d = require(p);

      return Object.assign({}, prev, d);
    } catch (e) {
      return prev;
    }
  });

  const all = Object.assign({}, indexData, data);

  return all;
}

const categories = [];

function compileAll() {
  categories.forEach((categoryPath) => {
    const baseTemplate = fs.readFileSync(path.join(__dirname, 'templates', categoryPath, 'template.md'), 'utf8');

    const entries = fs.readdirSync(path.join(__dirname, 'templates', categoryPath));
    entries.filter(p => fs.statSync(path.join(__dirname, 'templates', categoryPath, p)).isDirectory()).forEach(entry => {
      const data = prepareData(path.join(categoryPath, entry));
      const output = parse(baseTemplate, data);

      const filePath = path.join(__dirname, '../docs', categoryPath, entry + '.md');
      mkdirp(path.dirname(filePath));
      fs.writeFileSync(filePath, output);
    });
  });
}

compileAll();
