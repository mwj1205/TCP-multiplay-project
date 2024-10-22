import User from '../classes/models/user.class.js';
import { UserSessions } from './sessions.js';

// 유저 세션 추가
export const addUser = (socket, uuid) => {
  const user = new User(uuid, socket);
  UserSessions.push(user);
  return user;
};

// 유저 세션 삭제
export const removeUser = (socket) => {
  const index = UserSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return UserSessions.splice(index, 1)[0];
  }
};

// 시퀀스 올려주는 함수
export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

// id로 유저 조회
export const getUserById = (id) => {
  return UserSessions.find((user) => user.id === id);
};
