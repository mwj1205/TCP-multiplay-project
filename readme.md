# TCP 멀티플레이 프로젝트

```
multiplayProject
├─ .gitignore
├─ .prettierrc
├─ client.js
├─ client2.js
├─ package-lock.json
├─ package.json
├─ readme.md
└─ src
   ├─ server.js
   ├─ classes
   │  ├─ managers
   │  │  ├─ base.manager.js
   │  │  └─ interval.manager.js
   │  └─ models
   │     ├─ game.class.js
   │     └─ user.class.js
   ├─ config
   │  └─ config.js
   ├─ constants
   │  ├─ env.js
   │  ├─ handlerIds.js
   │  └─ header.js
   ├─ db
   │  ├─ database.js
   │  ├─ migration
   │  │  └─ createSchemas.js
   │  ├─ sql
   │  │  └─ user_db.sql
   │  └─ user
   │     ├─ user.db.js
   │     └─ user.queries.js
   ├─ events
   │  ├─ onConnection.js
   │  ├─ onData.js
   │  ├─ onEnd.js
   │  └─ onError.js
   ├─ handlers
   │  ├─ index.js
   │  ├─ game
   │  │  ├─ createGame.handler.js
   │  │  ├─ joinGame.handler.js
   │  │  └─ updateLocation.handler.js
   │  └─ user
   │     └─ initial.handler.js
   ├─ init
   │  ├─ index.js
   │  └─ loadProtos.js
   ├─ protobuf
   │  ├─ packetNames.js
   │  ├─ notification
   │  │  └─ game.notification.proto
   │  ├─ request
   │  │  ├─ common.proto
   │  │  ├─ game.proto
   │  │  └─ initial.proto
   │  └─ response
   │     └─ response.proto
   ├─ session
   │  ├─ game.session.js
   │  ├─ sessions.js
   │  └─ user.session.js
   └─ utils
      ├─ db
      │  └─ testConnection
      ├─ error
      │  ├─ customError.js
      │  ├─ errorCodes.js
      │  └─ errorHandler.js
      ├─ notification
      │  └─ game.notification.js
      ├─ parser
      │  └─ packetParser.js
      ├─ response
      │  └─ createResponse.js
      ├─ dateFormatter.js
      └─ transfromCase.js
```
