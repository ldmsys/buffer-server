# buffer-server 
 * Simple and single file host by Buffer's data

## Notice
 * This project is subproject of FADe Project
 * Internally used by FADe, Licensed under same license of FADe.

## Usage
 * Install project:
```
 $ npm install @fade-project/buffer-server
```
 * Put in your project:
```
var bshs = require('@fade-project/buffer-sftp-http-server)
```
 * bshs.sftp_server(serverKey, allowedUser, allowedPass, filename, filedata[, ret_port]);
   * Accept Parameters as a String, except filedata (it's a Buffer).
 * bshs.web_server(index, filename, filedata[, ret_port]);
   * Also Accept Parameters as a String, except filedata (it's also a buffer).
 * In default, web_server() returns Port Number. You may change by set ret_port option to false
 * In default, sftp_server() returns Promise(Will resolved to Port Number), You may change by ret_port option to false

## Credit
 * [express](https://github.com/expressjs/express) - [MIT License](https://github.com/expressjs/express/blob/master/LICENSE)
 * [ssh2](https://github.com/mscdex/ssh2) - [MIT License](https://github.com/mscdex/ssh2/blob/master/LICENSE)
