import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import createGameHandler from './game/createGame.handler.js';
import joinGameHandler from './game/joinGame.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import initialHandler from './user/initial.handler.js';

// 핸들러 매핑
const handlers = {
  [HANDLER_IDS.INITIAL]: {
    // 0을 의미함
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
  [HANDLER_IDS.CREATE_GAME]: {
    // 4을 의미함
    handler: createGameHandler,
    protoType: 'game.CreateGamePayload',
  },
  [HANDLER_IDS.JOIN_GAME]: {
    // 5을 의미함
    handler: joinGameHandler,
    protoType: 'game.JoinGamePayload',
  },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    // 6
    handler: updateLocationHandler,
    protoType: 'game.UpdateLocationPayload',
  },
};

// handerId로 handler 탐색
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.INVALID_SEQUENCE,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }

  return handlers[handlerId].handler;
};

// handerId로 protoType
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.INVALID_SEQUENCE,
      `프로토타입을 찾을 수 없습니다: ID ${handlerId}`,
    );
  }

  return handlers[handlerId].protoType;
};
