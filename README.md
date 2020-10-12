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
---
import buffer_server from 'buffer-server';
```
 * buffer_server.sftp_server(serverKey(:string), allowedUser(:string), allowedPass(:string), filename(:string), filedata(:Buffer))(: Promise<number>)
 * buffer_server.web_server(index(:string), filename(:string), filedata(Buffer))(: Promise<number>)

## Credit
 * [express](https://github.com/expressjs/express) - [MIT License](https://github.com/expressjs/express/blob/master/LICENSE)
 * [ssh2](https://github.com/mscdex/ssh2) - [MIT License](https://github.com/mscdex/ssh2/blob/master/LICENSE)

## License
 * [MIT License](LICENSE)