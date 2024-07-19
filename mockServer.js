const express = require('express');
const net = require('net');
//const serverConfig = require('./config.json').servers;

const serverConfig = [
    { host: 'localhost', port: 27017, type: 'fast',activeConnections: 0,healthy:true},
    { host: 'localhost', port: 27018, type: 'slow',activeConnections: 0,healthy:true},
    { host: 'localhost', port: 27019, type: 'fast',activeConnections: 0,healthy:true},
    { host: 'localhost', port: 27020, type: 'slow',activeConnections: 0,healthy:false},
    { host: 'localhost', port: 27021, type: 'fast',activeConnections: 0,healthy:true},
];

const serverConnections = {};

//create multiple instances of express in order to create multiple servers use list containg arguments as host and port

const createServer = (host,port,type)=>{

    const app = express();
    let connections = 0;

    serverConnections[port] = {host,port,type,open_connections:connections};

    app.use(express.json());

    app.get('/', (req, res) => {
        type = serverConfig.find(server => server.port === port).type;
        //console.log(`Request to ${host}:${port} with ${type} response`);
        const responseTime = type === 'fast' ? 100 : 3000; // Fast: 100ms, Slow: 3000ms
        //console.log(`Request to ${host}:${port} with ${type} response will take ${responseTime}ms`);
        setTimeout(() => {
            res.send(`Hello from MockServer at ${host}:${port} with ${type} response`);
        }, responseTime);
    });

    app.get('/health',(req,res)=>{
        const curr_server = serverConfig.find(server => server.port===port);
        const health = curr_server.healthy
        if(health){
            res.status(200).json({status:'UP'});
        }
        else{
            res.status(500).json({status:'DOWN',message:'Server is down',port:port});
        }
        //res.status(200).json(health);
    })

    app.get('/connections',(req,res)=>{
        res.json({host, port, open_connections: connections});
    })
    
    const currentServer=app.listen(port,()=>{
        console.log(`Server running on ${host}:${port}`);
    });

    currentServer.on('connection', (socket) => {
        connections++;
        serverConnections[port].open_connections = connections;
        console.log(`New connection established on ${host}:${port}. Total connections: ${connections}`);
    
        socket.on('close', () => {
            connections--;
            serverConnections[port].open_connections = connections;
            console.log(`Connection closed on ${host}:${port}. Total connections: ${connections}`);
        });
    });
}
serverConfig.forEach((server)=>{
    createServer(server.host,server.port);
});