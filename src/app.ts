'use strict';
import MqttService from './MqttService';
import APIService from './APIService';
import DatabaseService from './DatabaseService';

DatabaseService.start();
APIService.start();
MqttService.start();
