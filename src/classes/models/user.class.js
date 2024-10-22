import { createPingPacket } from '../../utils/notification/game.notification.js';

// 유저 클래스
class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.latency = 0;
  }

  // 유저의 x, y 위치 변경
  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  // sequence 증가
  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 초 단위로 변경
    const speed = 1; // 속력은 일단 고정
    const distance = speed * timeDiff;

    // x만 움직인다고 가정
    return {
      x: this.x + distance,
      y: this.y,
    };
  }
}

export default User;
