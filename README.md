<p align="center">
  <img width="150" height="150" src="https://github.com/user-attachments/assets/33c8d60b-1a9e-47ed-8b5f-19e63371a762">
</p>

# PM2 Dash - Graphical User Interface for PM2

## Features
- PM2 base commands (list/restart/stop/reset/flush)
- Material UI grid for PM2 processes (Name, ID, resourse usage, operations)
- Download and save output/error log file
- User, role and permission management (action per PM2 process) with HTTP mode
- Readonly mode (disable buttons with 'Write' action)

### Modes
1. Client only (Local IPC connect to PM2)
2. Client <-> Server (API server with HTTP protocol)

### Stack

- Electron.js as client
- React.js (MUI) as UI
- Node.js (fastify) as server
- SQLite as server database
- Chromium localstorage as client cache storage

### Screenshots

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
| IPC ![connect ipc](https://github.com/user-attachments/assets/89476670-11a0-48f3-8e4a-96354e5b946a) | HTTP ![connect http](https://github.com/user-attachments/assets/83d1c237-22f0-47b2-935d-1dcb503fc356) | List ![empty list](https://github.com/user-attachments/assets/cdeef7a1-b34d-4fd3-84dd-4587dffc5642)


