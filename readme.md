# Advanced Node.js Load Balancer

## Project Overview

The Advanced Node.js Load Balancer is a robust system designed to dynamically route incoming API requests to various endpoints based on multiple criteria. This project implements advanced queue management strategies to optimize performance and ensure reliability. Key features include health checks, rate limiting, caching, and failover mechanisms.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [Usage Instructions](#usage-instructions)
6. [Queue Management and Analysis](#queue-management-and-analysis)
7. [Conclusion](#conclusion)

## Features

- **Dynamic Routing**: Routes requests based on API type, request payload size, and randomized routing for load balancing.
- **Queue Management**: Implements FIFO, priority-based, and round-robin queuing strategies.
- **Health Checks**: Periodically checks server health and routes requests only to healthy servers.
- **Rate Limiting**: Limits the number of requests per minute from a single IP.
- **Caching**: Stores responses for frequently requested resources to improve performance.
- **Failover Mechanism**: Redirects requests if a server becomes unresponsive.
- **Comprehensive Logging and Analysis**: Logs request times, endpoint selections, and response times for performance analysis.

## Technologies Used

- **Node.js**: Backend runtime for building scalable server-side applications.
- **Express.js**: Web framework for managing routing and middleware.
- **Axios**: Promise-based HTTP client for server communication.
- **Morgan**: HTTP request logger for monitoring traffic.
- **Queue**: Asynchronous queue management for handling requests.
- **express-rate-limit**: Middleware for rate limiting to prevent overload.
- **JavaScript**: Programming language used for server-side logic.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/load-balancer.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the server**:
   ```bash
   npm start
   ```

## Usage Instructions

1. **Starting the load balancer**:
   After starting the server with node index.js, the load balancer will run on port 3000.

2. **Sending a request**:
   Use a tool like curl or Postman to send requests to the load balancer:

   ```bash
   curl -X POST http://localhost:3000/api/v1/resource -d '{"key": "value"}'
   ```

3. **Configuring Endpoints**:
   Update the mockServers array in config/config.js to include your actual server endpoints.

## Queue Management and Analysis

# Queue Types

1.**FIFO (First-In-First-Out)**:
Processes requests in the order they arrive. Suitable for general use where all requests are equally important. 2.**Priority Queue**:
Prioritizes requests based on predefined criteria, such as payload size. Useful for handling important or time-sensitive requests. 3.**Round-Robin Queue**:
Distributes requests evenly among available servers, ensuring balanced load distribution.

# Queue Analysis

1.**FIFO Queue**:
Simple and fair but may lead to longer wait times for critical requests. 2.**Priority Queue**:
Ensures critical requests are handled quickly but may cause delays for less important requests. 3.**Round-Robin Queue**:
Balances load effectively but does not account for server performance variations.

## Conclusion

    The Advanced Node.js Load Balancer project demonstrates a comprehensive implementation of a dynamic load balancer with advanced queue management and additional features to ensure efficient and reliable request handling. The setup and usage instructions, detailed analysis of different queuing strategies, and innovative ideas for further enhancement are all provided in this documentation.
