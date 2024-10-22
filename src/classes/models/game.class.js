import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id; // 게임 방의 고유한 키 값
    this.users = []; // 게임 방에 참가한 유저들
    this.intervalManager = new IntervalManager(); // 게임마다 intervalManager도 추가
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    // ping interval 추가
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 10000);
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  // 게임의 유저 중 최대 Latency
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  // 게임 시작
  startGame() {
    this.state = 'inProgress';
    // 게임 시작 패킷 생성
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(this.getMaxLatency());

    // 게임 룸의 모든 유저에게 전송
    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
