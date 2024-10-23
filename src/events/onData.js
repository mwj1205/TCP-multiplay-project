import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handlerError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

// 들어온 데이터 처리
export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0); // 4바이트. 패킷 전체 길이
    const packetType = socket.buffer.readUInt8(config.packet.totalLength); // 1바이트 패킷 타입

    if (socket.buffer.length >= length) {
      // 모든 패킷이 도착했으면
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      console.log(`length: ${length}, packetType: ${packetType}`);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:
            {
              // 핑 패킷 처리
              const protoMessages = getProtoMessages();
              const Ping = protoMessages.common.Ping;
              const pingMessage = Ping.decode(packet);
              const user = getUserBySocket(socket);
              if (!user) {
                throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
              }
              user.handlePong(pingMessage);
            }
            break;
          case PACKET_TYPE.NORMAL:
            const { handlerId, userId, payload, sequence } = packetParser(packet);

            // sequence (유저의 호출 수) 검증
            const user = getUserById(userId);
            if (user && user.sequence !== sequence) {
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값 입니다.');
            }

            const handler = getHandlerById(handlerId);

            await handler({ socket, userId, payload });
        }
      } catch (e) {
        handlerError(socket, e);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않았음
      break;
    }
  }
};
