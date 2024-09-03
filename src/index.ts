'use strict';
import { Logger } from 'sitka';

import Aedes from 'aedes'
import server from 'net'
import http from 'http'
import ws from 'websocket-stream'

const mqPort = 1883
const wsPort = 8888

const logger = Logger.getLogger({ name: 'main' });
const aedes = new Aedes()
const mqServer = server.createServer(aedes.handle)
const wsServer = http.createServer()

mqServer.listen(mqPort, function () {
	logger.info('MQTT server listening on port => ', mqPort);
})

ws.createServer({
	server: wsServer
}, aedes.handle as any)

wsServer.listen(wsPort, function () {
	logger.info('Websocket server listening on port => ', wsPort);
})

aedes.on('publish', function (packet, client) {
	if (client) {
		console.info('message from client', client.id)
	}
})

aedes.on('subscribe', function (subscriptions, client) {
	if (client) {
		console.info('subscribe from client', subscriptions, client.id)
	}
})

aedes.on('client', function (client) {
	logger.info('new client', client.id);
})

aedes.on('clientDisconnect', function (client) {
	logger.warn('client disconnected', client.id);
})
