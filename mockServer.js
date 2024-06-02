const express = require('express');
const app = express();
const PORT = process.argv[2] || 4000;

app.use(express.json());

// Simulate different response times
app.get('/api/fast', (req, res) => {
    setTimeout(() => {
        res.send({ message: 'Fast response' });
    }, 100);
});

app.get('/api/slow', (req, res) => {
    setTimeout(() => {
        res.send({ message: 'Slow response' });
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Mock server running on port ${PORT}`);
});
