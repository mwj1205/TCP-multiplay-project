import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId, x, y } = payload;
    console.log('userId: ', userId);
    console.log('payload: ', payload);
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, `게임 세션을 찾을 수 없습니다: ${gameId}`);
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    user.updatePosition(x, y);
    const packet = gameSession.getAllLocation();

    socket.write(packet);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default updateLocationHandler;
