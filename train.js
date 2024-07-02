const brain = require('brain.js');
const fs = require('fs');
const trainModel = require('./trainModel');

// Path to save the trained model
const modelPath = 'model.json';

// Train the model (you can comment this line if you don't want to retrain every time)
trainModel(['srt/1 (1).srt', 'srt/1 (5).srt','srt/1 (6).srt','srt/1 (7).srt'], modelPath);

// Load the trained model
const net = new brain.recurrent.LSTM();
const savedJson = fs.readFileSync(modelPath);
net.fromJSON(JSON.parse(savedJson));

// Function to generate a response with some creativity
function generateResponse(input) {
  let output = net.run(input);
  
  // Add some creativity: If the input is unknown, generate a random response
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

  console.log(`Input: ${input}`);
  console.log(`Output: ${output}`);
  return output;
}

// Example usage
generateResponse("hello");
generateResponse("how are you");
generateResponse("what is your name");
generateResponse("tell me a joke");
generateResponse("goodbye");
generateResponse("unknown question");
