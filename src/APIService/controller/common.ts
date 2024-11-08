import { RocketService } from '../../ManageService';

export const controller = {
  sendMessage: async (rocket: RocketService, _cbData: () => any) => {
    rocket.sendMessage('mqtt-service', _cbData());
  },
};
