# buffer-server 
 * Simple and single file host by Buffer's data

## Usage
 * Install project:
```
 $ npm install buffer-server
```
 * require() in your project:
```
var buffer_server = require('buffer-server')
```
 * buffer_server.sftp_server(serverKey, allowedUser, allowedPass, filename, filedata);
   * Accept Parameters as a String, except filedata (it's a Buffer).
 * buffer_server.web_server(index, filename, filedata[, ret_port]);
   * Also Accept Parameters as a String, except filedata (it's also a buffer).
 * web_server() and sftp_server() returns Promise. It will resolve to Buffer. (TS: Promise<Buffer>)

## Credit
 * [express](https://github.com/expressjs/express) - [MIT License](https://github.com/expressjs/express/blob/master/LICENSE)
 * [ssh2](https://github.com/mscdex/ssh2) - [MIT License](https://github.com/mscdex/ssh2/blob/master/LICENSE)

## License
 * [MIT License](LICENSE)
