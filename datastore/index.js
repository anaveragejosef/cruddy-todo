const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
      console.log('Cannot read All: ', err);
    } else {
      // create output array
      let allTodo = [];
      // iterate over filename of files
      files.forEach(fileName => {
        let todoId = fileName.slice(0, 5);
        // create object for each filename (2 keys: point to file name)
        let todo = {id: todoId, text: todoId};
        // push into the output array
        allTodo.push(todo);
      });
      // call callback passing back interited err & output array
      callback(err, allTodo);
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
