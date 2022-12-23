Workflow:
https://whimsical.com/honorous-betting-QyoBgmT5gY9jKosoAKQJwT

This is a backend project using mongodb, node.js for Honorous

Let's get started
## Server Deployment Order

### (Optional) Seeding Database with dummy data

```bash
yarn seed
```

### 1. Syncing the Database with past emitted events
Syncing with past events. This script will fill out the database without duplication
```bash
yarn sync_past_events
```
or 
```bash
npm run sync_past_events
```

### 2. Making sure running the cron job to sync event in the future
Running Cron job
```bash
ts-node src/cron/index.ts
```

### 3. Running the server
```bash
npm start
```
or
```bash
yarn start
```
