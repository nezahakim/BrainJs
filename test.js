const brain = require('brain.js');
const fs = require('fs');

// Load the trained model
const net = new brain.recurrent.LSTM();
const savedJson = fs.readFileSync('model.json');
net.fromJSON(JSON.parse(savedJson));

// Function to generate a response with some creativity
function generateResponse(input) {
  let output = net.run(input);
  
  if (!output) {
    const randomResponses = [
      "That's interesting, tell me more!",
      "I don't quite understand, can you elaborate?",
      "Hmmm, I'm not sure about that.",
      "That's a new one for me!",
      "Can you rephrase that?"
    ];
    output = randomResponses[Math.floor(Math.random() * randomResponses.length)];
  }

  return output;
}

// Example usage in a chat application
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`You: `, (input) => {
  const response = generateResponse(input);
  console.log(`AI: ${response}`);
  readline.close();
});
