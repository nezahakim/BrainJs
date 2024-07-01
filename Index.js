const brain = require('brain.js');
const http = require('http');
const fs = require('fs');

// Create a new instance of a neural network with LSTM
const net = new brain.recurrent.LSTM();

// Prepare more diverse training data
const trainingData = [
  { input: "hello", output: "hi there" },
  { input: "how are you", output: "I am fine, thank you" },
  { input: "what is your name", output: "I am an intelligent AI" },
  { input: "tell me a joke", output: "Why don't scientists trust atoms? Because they make up everything!" },
  { input: "goodbye", output: "see you later" },
  // Add more varied conversational data
];

// Train the network
net.train(trainingData, {
  iterations: 5000, // Increase iterations for better training
  log: true,
  logPeriod: 100
});

// HTTP server example to handle requests
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Assuming input data is in JSON format
    });
    req.on('end', () => {
      const inputData = JSON.parse(body);
      const outputData = net.run(inputData.text); // Example: assuming input is {"text": "hello"}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response: outputData }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  
