import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { getNextSequence } from '../../session/user.session.js';

// response 생성
export const createResponse = (handlerid, responseCode, data = null, userId) => {
  // 프로토타입 가져오기
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;

  // payload 생성
  const responsePayload = {
    handlerid,
    responseCode,
    timestamp: Date.now(),
    data: data ? Buffer.from(JSON.stringify(data)) : null,
    sequence: userId ? getNextSequence(userId) : 0,
  };

  // 버퍼 생성
  const buffer = Response.encode(responsePayload).finish();

  // 헤더 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUint32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUint8(PACKET_TYPE.NORMAL, 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};
