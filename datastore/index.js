const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = [];
      files.forEach(fileName => {
        fileName = fileName.slice(0, fileName.length - 4);
        data.push({
          id: fileName,
          text: fileName
        });
      });
      callback(null, data);
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
