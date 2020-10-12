/// <reference types="node" />

export function sftp_server(serverKey: string, allowedUser: string, allowedPass: string, filename: string, filedata: Buffer): Promise<number>;
export function web_server(index: string, filename: string, filedata: Buffer): Promise<number>;