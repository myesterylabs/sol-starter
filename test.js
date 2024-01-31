const fs = require('fs');

function getLastModifiedTimeAsync(folderPath) {
  return new Promise((resolve, reject) => {
    fs.stat(folderPath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats)
        resolve(stats.mtime);
      }
    });
  });
}

// Example usage
const folderPath = '/Users/myestery/works/myestery/sol-starter2';

getLastModifiedTimeAsync(folderPath)
  .then(lastModifiedTime => {
    console.log(`Last modified time of ${folderPath}: ${lastModifiedTime}`);
  })
  .catch(err => {
    console.error(`Error getting last modified time: ${err.message}`);
  });
