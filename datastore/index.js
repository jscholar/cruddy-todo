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
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, null, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (cb) => {

  var readOneAsync = Promise.promisify(exports.readOne);
  fs.readdir(exports.dataDir, (e, files) => {
    if (e) {
      cb(e);
    } else {
      // Filenames retrieved
      var todoPromises = files.map(filename => readOneAsync(filename.slice(0, filename.length - 4)));

      Promise.all(todoPromises)
        .then(d => cb(null, d))
        .catch(cb);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: data.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  // call read file, its simle after taht
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (!err) {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, null, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
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
