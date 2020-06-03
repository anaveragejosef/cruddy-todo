const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const PromisifedReadFileAsync = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('Cannot read count ID: ', err);
    } else {
      // console.log('data: ', data); //0004
      // return data;
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          console.log('Cannot create new file: ', err);
        } else {
          // callback(err, id);
          callback(null, { id, text });
          // items[id] = text;
        }
      });
    }
  });
};
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      var promiseArr = files.map(fileName => {
        // console.log(PromisifedReadFileAsync(path.join(exports.dataDir, fileName)));
        return PromisifedReadFileAsync(path.join(exports.dataDir, fileName))
          .then((data) => {
            // console.log(data.toString()); //todo1 , todo2
            return {id: fileName.slice(0, 5), text: data.toString()};
          });
      });
      return Promise.all(promiseArr)
        .then((results) => {
          callback(null, results);
        });
    }
  });
};

exports.readOne = (id, callback) => {
  // Use fs.readFile - Pass in path with file name, callback (err and data)
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    // Test for errors
    if (err) {
      // If so, console log error message
      callback(new Error(`No item with id: ${err}`));
    } else { // If there is no error
      // Callback with err and an object literal with id and text (Use data var)
      callback(err, {id: id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    // Test for errors
    if (err) {
      // If so, console log error message
      callback(new Error(`No item with id: ${err}`));
    } else { // If there is no error
      // use writeFile passing path, text, callback with only one err
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        // test err
        if (err) {
          // callback with new error
          callback(new Error(`No item with id: ${err}`));
        } else {
          // callback with err and {id: id, text: text}
          callback( err, {id: id, text: text} );
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // Call unlink using path and one err param for callback
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    // Test for error and alert if found
    if (err) {
      callback(new Error(`Cannot delete item. Item does not exist: ${err}`));
    } else {
    // If no error, callback to notify completion
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
