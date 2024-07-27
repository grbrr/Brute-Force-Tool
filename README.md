# Brute-Force-Tool

This tool is designed for educational purposes and for use in authorized penetration testing environments only. Do not use this tool for illegal or unethical activities. The author is not responsible for any misuse of this tool.

## Features

- Hashing with MD5
- Reading wordlists
- Sending HTTP requests
- Brute forcing passwords

### Target Algorithm

The target system uses a challenge-response authentication mechanism where the client's password is hashed using a nonce (a unique identifier) provided by the server. This nonce is combined with the user's password, and the resulting string is hashed using the MD5 algorithm. The server then verifies the hash to grant or deny access.

### How the Code Adapts to This Algorithm

1. **Nonce Retrieval**: The tool sends a GET request to the target URL to retrieve the nonce value (`hpsw_id`) from the server's response. This value is dynamically fetched each time the tool runs.
2. **Wordlist Processing**: The tool reads password candidates from wordlist files located in a specified directory. These wordlists contain potential passwords that the tool will test.
3. **Hash Generation**: For each password candidate, the tool concatenates the nonce and the password, and then computes the MD5 hash of this combined string.
4. **POST Request**: The generated hash is sent to the server via a POST request. The server's response is parsed to determine if access is granted or denied.
5. **Looping Through Wordlists**: The tool iterates through all password candidates in the wordlists, sending the corresponding hashes to the server until a successful match is found or all candidates are exhausted.
6. **Valid Result Detection**: After each POST request, the tool parses the server's response to detect if the result is valid. It checks for the presence of an error message indicating "Controller access denied". If this message is not found, it concludes that access is granted. The tool logs the file and password that resulted in a successful match and stops further attempts. It couldn't be done with http res codes as the target is always giving status 200.

## Usage

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Put wordlists of your choice to **wordlists** directory, check out [SecLists repo](https://github.com/danielmiessler/SecLists).
4. Change url in **./src/httpRequests.js**
5. Run the tool

   ```bash
   npm start
   ```

6. You shall see cookie retrieved from first response, which file is currently checked and if you get the result - which password did it.
