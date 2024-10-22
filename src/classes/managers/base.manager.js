// 모든 매니저에 대한 부모 클래스

class BaseManager {
  constructor() {
    // BaseManager 그 자체로는 생성될 수 없도록 함
    if (new.target === BaseManager) {
      throw new TypeError('Canno construct BaseManager instances');
    }
  }

  addPlayer() {
    throw new Error('Method not implemented.');
  }

  removePlayer() {
    throw new Error('Method not implemented.');
  }

  clearAll() {
    throw new Error('Method not implemented.');
  }
}

export default BaseManager;
