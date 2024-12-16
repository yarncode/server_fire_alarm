import { RocketService } from '../../ManageService';
import { ServiceType } from '../../Constant/interface';

export const controller = {
  sendMessage: async (
    rocket: RocketService,
    service: ServiceType,
    _cbData: () => any
  ) => {
    rocket.sendMessage(service, _cbData());
  },
};
