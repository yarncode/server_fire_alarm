'use strict';
import MqttService from './MqttService';
import APIService from './APIService';
import DatabaseService from './DatabaseService';
import SocketIOService from './SocketIOService';

DatabaseService.start();
APIService.start();
MqttService.start();
SocketIOService.start();
