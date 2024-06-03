const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
//const serverConfig = require('./config.json').servers;
const serverConfig = [
    { host: 'localhost', port: 27017, type: 'fast'},
    { host: 'localhost', port: 27018, type: 'slow'},
    { host: 'localhost', port: 27019, type: 'fast'},
    { host: 'localhost', port: 27020, type: 'slow'},
    { host: 'localhost', port: 27021, type: 'fast'}
];
//const roundRobin = require('./queueSelection');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { log } = require('console');

const app = express();
const PORT = 3000;

// const logFile = path.join(__dirname, 'D:/Load_Balancer/Dynamic-Load-Balancer/requestLogs.json');

// // Function to log metrics
// const logMetrics = (logData) => {
//     fs.appendFileSync(logFile, JSON.stringify(logData) + '\n', 'utf8');
// };

// Create multiple instances of express in order to create multiple servers
// const mockServer = serverConfig.map(server=>({
//     ...server
// }));    

// const LB_ALGO = 'roundRobin';

// app.get('/', (req, res) => {
//     if(LB_ALGO === 'roundRobin'){
//         roundRobin(mockServer,req,res);
//     }else{
//         res.writeHead(200);
//         res.send('Hello from Load Balancer');
//     }
// });

// app.use(morgan('combined'));
// app.use(express.json());

// function getRandomServer() {
//     return mockServers[Math.floor(Math.random() * mockServers.length)];
// }

// function routeBasedOnPayloadSize(req) {
//     if (req.body && JSON.stringify(req.body).length > 100) {
//         return mockServers[1]; // Route to a specific server for large payloads
//     }
//     return getRandomServer(); // Otherwise, random server
// }

// // Forward requests to the appropriate mock server
// app.use(async (req, res, next) => {
//     const start = Date.now();
//     // Extract the type from the URL  (e.g. /api/fast -> fast)
//     const type = req.url.split('/')[2];
//     const server = routeBasedOnPayloadSize(req);
//     const url = `${server}/api/${type}`;

//     try {
//         const response = await axios.get(url);
//         const duration = Date.now() - start;
//         fs.appendFileSync('logs.txt', `Request to ${url} took ${duration}ms\n`);
//         res.send(response.data);
//     } catch (error) {
//         const duration = Date.now() - start;
//         fs.appendFileSync('logs.txt', `Request to ${url} failed after ${duration}ms\n`);
//         res.status(500).send({ error: 'Error forwarding request' });
//     }
// });

// Routing logic based on custom criteria

let currentServer = 0;
const selectServer = (req) => {
    //addition custom logic based on payload size
    const targetServer = serverConfig[currentServer];
    currentServer = (currentServer + 1) % serverConfig.length;
    //console.log(`Routing to ${targetServer.host}:${targetServer.port}`);
    return targetServer;
};

// Function to route based on payload size 
const routeBasedOnPayloadSize = (req) => {
    if (req.body && JSON.stringify(req.body).length > 100) {
        return serverConfig[4]; // Route to a specific server for large payloads
    }
    return selectServer(req); // Otherwise, Round robin server
};

app.use((req, res, next) => {
    const startTime = Date.now();
    const payloadSize = req.body ? JSON.stringify(req.body).length : 0;
    console.log(`Payload size: ${payloadSize}`);
    const method_type = req.method;
    console.log(`Request to ${req.url} with ${method_type} method`);
    //console.log(`Request to ${req.url}`);
    const targetServer = routeBasedOnPayloadSize(req);
    //console.log(`Routing to ${targetServer.host}:${targetServer.port}`);
    const targetUrl = `http://${targetServer.host}:${targetServer.port}`;

    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            const logData = {
                timestamp: new Date(),
                method: req.method,
                url: req.url,
                target: targetUrl,
                startTime: startTime
            };
            //console.log(logData);
            fs.appendFileSync('log.txt', `${JSON.stringify(logData)}\n`);
        },
        onProxyRes: (proxyRes, req, res) => {
            const endTime = Date.now();
            const logData = {
                responseTime: endTime - startTime,
                statusCode: proxyRes.statusCode
            };
            //console.log(logData);
            fs.appendFileSync('logs.txt', `${JSON.stringify(logData)}\n`);
        }
    });
    proxy(req, res, next);
});

// Define a POST endpoint to test payload routing
app.post('test/', (req, res) => {
    // Log the received payload
    console.log('Received payload:', req.body);

    // Send a response
    res.send('Payload received successfully');
});

app.get('/connections', async (req, res) => {
    const connectionsData = {};
    for (const server of serverConfig) {
        try {
            const response = await axios.get(`http://${server.host}:${server.port}/connections`);
            connectionsData[server.port] = response.data;
        } catch (error) {
            console.error(`Error fetching connections from ${server.host}:${server.port}`, error);
        }
    }
    res.json(connectionsData);
});


app.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
});
