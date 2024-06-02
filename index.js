const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 3000;

const mockServers = [
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003'
];

app.use(morgan('combined'));
app.use(express.json());

function getRandomServer() {
    return mockServers[Math.floor(Math.random() * mockServers.length)];
}

function routeBasedOnPayloadSize(req) {
    if (req.body && JSON.stringify(req.body).length > 100) {
        return mockServers[1]; // Route to a specific server for large payloads
    }
    return getRandomServer(); // Otherwise, random server
}

app.use(async (req, res, next) => {
    const start = Date.now();
    const { type } = req.params;
    const server = routeBasedOnPayloadSize(req);
    const url = `${server}/api/${type}`;

    try {
        const response = await axios.get(url);
        const duration = Date.now() - start;
        fs.appendFileSync('logs.txt', `Request to ${url} took ${duration}ms\n`);
        res.send(response.data);
    } catch (error) {
        const duration = Date.now() - start;
        fs.appendFileSync('logs.txt', `Request to ${url} failed after ${duration}ms\n`);
        res.status(500).send({ error: 'Error forwarding request' });
    }
});

app.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
});
