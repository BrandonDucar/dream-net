
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    res.send('DreamOS Active');
});

const PORT = process.env.PORT || 3333;

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`DreamOS running on port ${PORT}`);
    });
}

export default app;
