import 'dotenv/config';
import { createApp } from './app';

const port = process.env.PORT || 8080;

const server = createApp().listen(port, () => {
  console.log(`server started on port ${port}`);
});

// Cloud Run sends SIGTERM before stopping an instance; stop accepting new
// connections and exit cleanly.
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});
