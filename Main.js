const brain = require('brain.js');
const fs = require('fs');

// Create a new instance of a neural network with LSTM
const net = new brain.recurrent.LSTM();

// Prepare more diverse training data
// const trainingData = [
//   { input: "hello", output: "hi there" },
//   { input: "how are you", output: "I am fine, thank you" },
//   { input: "what is your name", output: "I am an intelligent AI" },
//   { input: "tell me a joke", output: "Why don't scientists trust atoms? Because they make up everything!" },
//   { input: "goodbye", output: "see you later" },
//   // Add more varied conversational data
// ];

const trainingData = () => {
  const fileContent = fs.readFileSync('./dataset.txt', 'utf-8');
  let lines = fileContent.split(/,\s*(?=\n)/); // Split by comma followed by newline

  lines = lines.map(line => line.trim().replace(/^"|"$/g, '').replace(/\\r|\\n/g, '')); // Trim and remove enclosing quotes and newlines

  // Remove the trailing comma from the last entry if it exists
  if (lines[lines.length - 1].endsWith(',')) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
  }

  let trainData = [];
  
  for (let i = 0; i < lines.length; i += 2) {
    if (i + 1 < lines.length) {
      trainData.push({
        input: lines[i],
        output: lines[i + 1]
      });
    }
  }

  return trainData;
}
// console.log(trainingData())

let Tdata = trainingData()

// Train the network
net.train(Tdata, {
  iterations: 5000, // Increase iterations for better training
  log: true,
  logPeriod: 100
});

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

// // Example usage
generateResponse("hello");
generateResponse("how are you");
generateResponse("what is your name");
generateResponse("tell me a joke");
generateResponse("goodbye");
generateResponse("unknown question");

// Save the model
const json = net.toJSON();
fs.writeFileSync('model.json', JSON.stringify(json));

// Load the model
const savedJson = fs.readFileSync('model.json');
net.fromJSON(JSON.parse(savedJson));


const extendedTrainingData = [
  { input: "hello", output: "hi there" },
  { input: "how are you", output: "I am fine, thank you" },
  { input: "what is your name", output: "I am an intelligent AI made by NotifyCode Inc. I go by the name of NezaAI." },
  { input: "tell me a joke", output: "Why don't scientists trust atoms? Because they make up everything!" },
  { input: "goodbye", output: "see you later" },
  { input: "what is the weather like", output: "I can't check the weather, but you can look outside!" },
  { input: "do you like music", output: "I don't listen to music, but I can recommend some songs!" },
  // Add more varied conversational data
];

