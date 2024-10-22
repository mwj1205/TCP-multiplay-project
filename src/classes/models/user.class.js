// 유저 클래스
class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
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
}

export default User;
