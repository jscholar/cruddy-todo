const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

/**
 * Passes count as a Number into callback
 */
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      // Successfully wrote data
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
var counter = 0;

exports.getNextUniqueId = (callback) => {
  // Read contents of counter
  readCounter((error, count) => {
    if (error) {
      callback(err);
    } else {
      // Successfully read data
      writeCounter(count + 1, (error, countString) => {
        callback(null, countString);
      });
    }
  });
  //
};

exports.getNextUniqueId = Promise.promisify(exports.getNextUniqueId);



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
