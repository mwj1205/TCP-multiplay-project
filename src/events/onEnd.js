import { GameSessions, UserSessions } from '../session/sessions.js';
import { removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log('Client disconnected');

  console.log(UserSessions);
  console.log(GameSessions);

  removeUser(socket);
};
