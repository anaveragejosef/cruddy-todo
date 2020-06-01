const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

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
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// exports.getNextUniqueId = () => {
//   counter = counter + 1;
//   return zeroPaddedNumber(counter);
// };


exports.getNextUniqueId = (callback) => {

  // Invoke readCounter - Pass callback function as argument
  // Callback - takes two parameters, which are err and count/ID
  return readCounter((err, data) => {
    if (err) {
      console.log('Cannot read count ID: ', err);
      return;
    } else {
      // Within this callback invoke writeCounter - This takes count/ID and a callback
      // When we are passing the ID/count argument, increment
      return writeCounter((data + 1), ((err, countID) => {
        // Callback - return either the err (1st param) or count/ID (2nd param)
        if (err) {
          console.log('Cannot write count ID: ', err);
          return;
        } else {
          callback(err, countID);
        }
      }));
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
