import { v4 as uuidv4 } from 'uuid';
import { handlerError } from '../../utils/error/errorHandler.js';
import { addGameSession } from '../../session/game.session.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

// 게임 생성 핸들러
const createGameHandler = ({ socket, userId, payload }) => {
  try {
    // 게임 id 생성 (uuid)
    const gameId = uuidv4();
    // gameId를 가진 game 세션 생성
    const gameSession = addGameSession(gameId);

    // 게임을 생성한 유저를 방에 추가
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    gameSession.addUser(user);

    // 응답 생성
    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' },
      userId,
    );

    socket.write(createGameResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default createGameHandler;
