import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import initialHandler from './user/initial.handler.js';

// 핸들러 매핑
const handlers = {
  [HANDLER_IDS.INITIAL]: {
    // 0을 의미함
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
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
