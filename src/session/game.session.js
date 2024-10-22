import { GameSessions } from './sessions.js';

// 게임 세션 추가
export const addGameSession = (id) => {
  const session = new Game(id);
  GameSessions.push(session);
  return session;
};

// 게임 세션 삭제
export const removeGameSession = (id) => {
  const index = GameSessions.findIndex((game) => game.id === id);
  if (index !== -1) {
    return GameSessions.splice(index, 1)[0];
  }
};

// id로 게임 세션 검색
export const getGameSession = (id) => {
  return GameSessions.find((game) => game.id === id);
};

// 모든 게임 세션 검색
export const getAllGameSession = () => {
  return GameSessions;
};
