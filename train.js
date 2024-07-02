const fs = require('fs');
const brain = require('brain.js');
const srtParser = require('srt-parser-2');

// Function to load and parse subtitle files
function loadSubtitles(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parser = new srtParser();
  const parsedSubtitles = parser.fromSrt(content);

  // Extract dialogues and clean text
  let dialogues = parsedSubtitles.map(entry => entry.text.replace(/\r?\n|\r/g, ' '));
  return dialogues;
}

// Function to create training data pairs
function createTrainingData(dialogues) {
  let trainingData = [];
  
  for (let i = 0; i < dialogues.length - 1; i++) {
    trainingData.push({ input: dialogues[i], output: dialogues[i + 1] });
  }

  return trainingData;
}

// Example subtitle files (downloaded from OpenSubtitles)
const subtitleFiles = ['./srt/1 (1).srt', './srt/1 (4).srt','./srt/1 (5).srt',]; // Add your subtitle file paths here

let allDialogues = [];
subtitleFiles.forEach(file => {
  const dialogues = loadSubtitles(file);
  allDialogues = allDialogues.concat(dialogues);
});

// Create training data
const trainingData = createTrainingData(allDialogues);

// Create and train the neural network
const net = new brain.recurrent.LSTM();
net.train(trainingData, {
  iterations: 5000,
  log: true,
  logPeriod: 100
});

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

  console.log(`Input: ${input}`);
  console.log(`Output: ${output}`);
  return output;
}

// Example usage
generateResponse("hello");
generateResponse("how are you");

// Save the model
const json = net.toJSON();
fs.writeFileSync('model.json', JSON.stringify(json));

console.log('Model updated and saved.');
