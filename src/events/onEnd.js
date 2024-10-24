import { getGameSession } from '../session/game.session.js';
import { GameSessions } from '../session/sessions.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log('Client disconnected');

  const user = getUserBySocket(socket);
  if (user) {
    // 유저가 게임에 참여중이었다면 제거
    if (user.gameId) {
      const game = getGameSession(user.gameId);
      if (game) {
        game.removeUser(user.id);
      }
    }
  }

  console.log('GameSessions: ', GameSessions);

  removeUser(socket);
};
