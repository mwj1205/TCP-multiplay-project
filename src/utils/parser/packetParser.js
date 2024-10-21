import { config } from '../../config/config.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조 (common 패킷) 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data);
  } catch (e) {
    console.error(e);
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  const sequence = packet.sequence;

  // 클라이언트 버전 체크
  if (clientVersion !== config.client.version) {
    console.error('클라이언트 버전이 일치하지 않습니다.');
  }

  // handler가 어떤 prototype을 사용하는지 가져옴
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    console.error(`알 수 없는 핸들러 Id: ${handlerId}`);
  }

  // '.'을 기준으로 namespace는 패키지 이름, 뒤는 타입 이름
  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = PayloadType.decode(packet.payload);
  } catch (e) {
    console.error(e);
  }

  // 디코드 하는 과정에서 verify도 하기 때문에 필요한 경우는 아님
  const errorMessage = PayloadType.verify(payload);
  if (errorMessage) {
    console.error('패킷 구조가 일치하지 않습니다: ', errorMessage);
  }

  // 필드가 비어있는 경우 = 필수 필드가 누락된 경우
  // 예시로 최초 접속 시에 userId는 비어있을거임. deviceID는 payload에 적혀있는데
  // 이게 에러인가? 아님. 없는걸 어떻게 보내. 있는 것만 파싱하자
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    console.error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
  }

  return { handlerId, userId, payload, sequence };
};
