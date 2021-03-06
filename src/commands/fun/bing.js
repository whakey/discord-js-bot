const Promise = require('bluebird');
const https = require('https');

const constants = require('../../../config/constants');

function randomBingImage(searchPhrase) {
  if (searchPhrase.length === 0) return;
  const options = {
    host: 'api.cognitive.microsoft.com',
    path: `/bing/v5.0/images/search?q=${searchPhrase}&safeSearch=off`,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': `${constants.BING_ID}`,
    },
  };
  return new Promise((resolve, reject) => {
    let images = '';
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        images += data;
      });
    });
    req.on('close', () => {
      const imageResult = JSON.parse(images);
      if (imageResult.value.length === 0) return (resolve('Couldnt find any images. :thinking:'));
      const rand = Math.floor(Math.random() * imageResult.value.length);
      const image = imageResult.value[rand];
      const imageUrl = image.thumbnailUrl ? image.thumbnailUrl : '';
      const name = image.name ? image.name : '';
      resolve(`${imageUrl} ${name}`);
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

module.exports = {
  bing: randomBingImage,
};
