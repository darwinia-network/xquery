import Arena from 'bull-arena';
import express from 'express';

const app = express();
const router = express.Router();
// inject prodiver  todo
const arena = Arena(
  {
    queues: [
      {
        // Required for each queue definition.
        name: 'pangoro-handleSourceChain',

        // User-readable display name for the host. Required.
        hostId: 'Server 1',

        // Queue type (Bull or Bee - default Bull).
        type: 'bee',
        host: '47.243.92.91',
        port: 6379,
        db: '5',
        password: '4d1ecc8ef3e8290',
      },
      {
        // Required for each queue definition.
        name: 'pangoro-handleDelivered',

        // User-readable display name for the host. Required.
        hostId: 'Server 1',

        // Queue type (Bull or Bee - default Bull).
        type: 'bee',
        host: '47.243.92.91',
        port: 6379,
        db: '5',
        password: '4d1ecc8ef3e8290',
      },
      {
        // Required for each queue definition.
        name: 'pangolin-handleDispached',

        // User-readable display name for the host. Required.
        hostId: 'Server 1',

        // Queue type (Bull or Bee - default Bull).
        type: 'bee',

        host: '47.243.92.91',
        port: 6379,
        db: '5',
        password: '4d1ecc8ef3e8290',
      },
    ],
  },
  {
    // Make the arena dashboard become available at {my-site.com}/arena.
    basePath: '/arena',

    // Let express handle the listening.
    disableListen: true,
  },
);

router.use('/', arena);
app.use(router);

app.listen(2000, () => {
  console.log('Ready, http://localhost:2000/arena');
});
