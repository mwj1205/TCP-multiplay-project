import { getGameSession } from '../session/game.session.js';
import { GameSessions } from '../session/sessions.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handlerError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  console.error('Socket error:', err);
  handlerError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

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

  // 세션에서 유저 삭제
  removeUser(socket);
};
