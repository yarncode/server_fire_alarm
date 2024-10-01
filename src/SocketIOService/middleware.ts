import { Socket } from 'socket.io';
import { UserMD } from '../DatabaseService/models/account';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCOUNT_MESSAGE } from '../APIService/controller/account';

interface PayloadDecodeRuntimeToken extends JwtPayload {
  email: string;
}

export const main_auth = {
  validate_token: async (socket: Socket, next: (err?: Error) => void) => {
    // console.log('Socket: ', socket.id, ' - Auth: ', socket.handshake.auth);
    
  },
};
