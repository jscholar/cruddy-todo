const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////

var items = {};

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      var todoObject = {
        id: id,
        text: text,
        createTime: Date.now()
      };
      fs.writeFile(path.join(exports.dataDir, `${id}.json`), JSON.stringify(todoObject), null, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  var readOneAsync = Promise.promisify(exports.readOne);
  fs.readdir(exports.dataDir, (e, files) => {
    if (e) {
      callback(e);
    } else {
      // Filenames retrieved
      var todoPromises = files.map(filename => readOneAsync(filename.slice(0, filename.length - 5)));

      Promise.all(todoPromises)
        .then(d => callback(null, d))
        .catch(callback);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.json', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};

exports.update = (id, text, callback) => {
  // call read file, its simle after taht
  fs.readFile(path.join(exports.dataDir, `${id}.json`), (err, data) => {
    if (!err) {
      var parsed = JSON.parse(data);
      parsed['updatedTime'] = Date.now();
      parsed['text'] = text;
      fs.writeFile(path.join(exports.dataDir, `${id}.json`), JSON.stringify(parsed), null, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, parsed);
        }
      });
    } else {
      callback(err);
    }
  });
};

exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

exports.create = Promise.promisify(exports.create);
exports.readAll = Promise.promisify(exports.readAll);
exports.readOne = Promise.promisify(exports.readOne);
exports.update = Promise.promisify(exports.update);
exports.delete = Promise.promisify(exports.delete);

