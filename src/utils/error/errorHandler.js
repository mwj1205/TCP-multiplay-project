import { createResponse } from '../response/createResponse.js';
import { ErrorCodes } from './errorCodes.js';

export const handlerError = (socket, error) => {
  // try-catch로 에러를 전달받았을 때 적절한 메세지를 클라이언트에 전송
  let responseCode;
  let message;
  console.error(error);

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${error.code}, 메세지: ${error.message}`);
  } else {
    // 모르는 에러
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반에러: ${error.message}`);
  }

  const errorResponse = createResponse(-1, responseCode, { message }, null);
  socket.write(errorResponse);
};
