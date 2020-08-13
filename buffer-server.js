const constants = require('constants');
const crypto = require('crypto');
const ssh2 = require('ssh2');
const express = require('express');
const app = express();

/* buffer-server Module
 * This Subproject is part of FADe Project
 * Copyright (C) ldmsys, License subject by main project
 * (Currently MIT License)
 */

exports.sftp_server = (serverKey, allowedUser, allowedPass, filename, filedata, ret_port = true) => {
/*
 * Universalized, Stripped-down version of
 * https://github.com/mscdex/ssh2/blob/master/examples/sftp-server-download-only.js
 * Thanks for awesome ssh2 module.
 */
	var port = 0;
	var server = new ssh2.Server({
	  hostKeys: [serverKey]
	}, (client) => {
	  client.on("authentication", (ctx) => {
		// Authentication
		if(ctx.method == "password" && ctx.user.length == allowedUser.length && crypto.timingSafeEqual(Buffer.from(ctx.user), Buffer.from(allowedUser))
		&& ctx.password.length == allowedPass.length && crypto.timingSafeEqual(Buffer.from(ctx.password), Buffer.from(allowedPass))) {
		  ctx.accept();
		}else{
		  ctx.reject(['password']);
		}
	  }).on('ready', () => {
		// Ready
		client.on('session', (accept, reject) => {
		  var session = accept();
		  
		  session.on('sftp', (accept, reject) => {
			// SFTP Connection
			var sftpStream = accept();
			var openFiles = {};
			var handleCount = 0;
			function onSTAT(reqid, path) {
			  if (path !== '/'+filename)
				return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
				var mode = constants.S_IFREG; // Regular file
				mode |= constants.S_IRWXU; // read, write, execute for user
				mode |= constants.S_IRWXG; // read, write, execute for group
				mode |= constants.S_IRWXO; // read, write, execute for other
			  sftpStream.attrs(reqid, {
				mode: mode,
				uid: 0,
				gid: 0,
				size: filedata.length,
				atime: Date.now(),
				mtime: Date.now()
			  });
			}
			var hl = (filedata.length+1>256)?256:filedata.length+1;
			sftpStream.on('OPEN', (reqid, reqFilename, flags, attrs) => {
			  if (reqFilename !== '/'+filename || !(flags & ssh2.SFTP_OPEN_MODE.READ))
				return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
			  var handle = Buffer.alloc(hl);
			  openFiles[handleCount] = { read: false };
			  handle.writeUInt32BE(handleCount++, 0, true);
			  sftpStream.handle(reqid, handle);
			}).on('READ', (reqid, handle, offset, length) => {
			  if (handle.length !== hl || !openFiles[handle.readUInt32BE(0, true)])
				return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
			  //var state = openFiles[handle.readUInt32BE(0, true)];
			  if (offset >= filedata.length)
				sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.EOF);
			  else {
				//state.read = true;
				sftpStream.data(reqid, filedata.slice(offset, offset+handle.length));
			  }
			}).on('CLOSE', (reqid, handle) => {
			  var fnum;
			  if (handle.length !== hl || !openFiles[(fnum = handle.readUInt32BE(0, true))])
				return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
			  delete openFiles[fnum];
			  sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
			}).on('REALPATH', (reqid, path) => {
			  sftpStream.name(reqid, {filename: "/"});
			}).on('STAT', onSTAT)
			.on('LSTAT', onSTAT);
		  });
		});
	  }).on("error", (e) => {
		  if(e.code !== 'ECONNRESET') {
			  console.error(e);
			  process.exit(1);
		  } // Ignore ECONNRESET Error
	  });
	}).listen(0, "0.0.0.0", () => {
		port = server.address().port;
	});
	if(!ret_port) {
		return server;
	}else{
		return new Promise((res, rej) => {
			setInterval(() => {
				if(port !== 0) res(port);
			}, 250);
		});
	}
 }

exports.web_server = (index, filename, filedata, ret_port = true) => {
    app.get('/', (req, res) => {
	  res.send(index);
	}).get('/'+filename, (req, res) => {
	  res.writeHead(200, {
		'Content-Disposition': `attachment; filename="${filename}"`,
		'Content-Type': "application/octet-stream"
	  });
	  res.end(filedata);
	})
	var server = app.listen(0, () => {});
	return ret_port ? server.address().port : app;
}