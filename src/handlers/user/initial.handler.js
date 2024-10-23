import { v4 as uuidv4 } from 'uuid';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { addGameSession, getAllGameSession } from '../../session/game.session.js';
import { addUser } from '../../session/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const findAvailableGame = () => {
  const allGames = getAllGameSession();
  return allGames.find((game) => game.state === 'waiting' && game.users.length < 4);
};

// 가장 최초에 접속했을 때 유저의 정보를 처리할 핸들러
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;
    console.log('payload: ', payload);

    // 유저 db 처리
    let user = await findUserByDeviceId(deviceId);
    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    // 세션에 유저 추가
    const sessionUser = addUser(socket, userId);
    sessionUser.setlatency(latency);
    sessionUser.setplayerId(playerId);

    // 게임 세션 찾기 또는 생성
    let gameSession = findAvailableGame();
    if (!gameSession) {
      const gameId = uuidv4();
      gameSession = addGameSession(gameId);
    }

    // 유저를 게임에 추가
    try {
      gameSession.addUser(sessionUser);
    } catch (e) {
      if (error.message === 'Game session is full') {
        const gameId = uuidv4();
        gameSession = addGameSession(gameId);
        gameSession.addUser(sessionUser);
      } else {
        throw error;
      }
    }

    // response 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id, gameId: gameSession.id },
      deviceId,
    );

    // 클라이언트에 전송
    socket.write(initialResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default initialHandler;
