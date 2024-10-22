import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../database.js';

const __filename = fileURLToPath(import.meta.url);
// 이 파일의 위치의 파일 이름을 제외한 경로
const __dirname = path.dirname(__filename);

// sql 파일 읽고 쿼리 실행하는 함수
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const quereis = sql
    .split(';') // 읽어온 sql 파일을 ; 단위로 나눔
    .map((query) => query.trim()) // 쿼리 양 끝의 공백 제거
    .filter((query) => query.length > 0); // 쿼리 길이가 0보다 큰 경우만 필터링
  for (const query of quereis) {
    await pool.query(query);
  }
};

// 스키마 생성
const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    // user_db.sql 파일을 확인하고 USER_DB에 테이블 생성
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));
  } catch (e) {
    console.error(`데이터베이스 테이블 생성 중 오류가 발생했습니다.: ${e}`);
  }
};

// 스키마 생성 작업 실행
createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
