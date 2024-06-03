const {createProxyMiddleware} = require('http-proxy-middleware');

//const proxy = proxyMiddleware.createProxyMiddleware({});

let currentServer = 0;

const roundRobin = (servers) => {
    return (req, res, next) => {
        const target = servers[currentServer];
        console.log(`Routing to ${target.host}:${target.port}`);
        currentServer = (currentServer + 1) % servers.length;
        createProxyMiddleware({ target: `http://${target.host}:${target.port}`, changeOrigin: true })(req, res, next);
    };
};

module.exports = roundRobin;