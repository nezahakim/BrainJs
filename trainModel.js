const brain = require('brain.js');
const fs = require('fs');

// Function to load and parse subtitle files manually
function loadSubtitles(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let dialogues = [];
  let currentDialogue = '';

  lines.forEach(line => {
    // Remove timestamps and empty lines
    if (!line.match(/^[0-9]+$/) && !line.match(/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/)) {
      if (line.trim() === '') {
        if (currentDialogue) {
          dialogues.push(currentDialogue.trim());
          currentDialogue = '';
        }
      } else {
        currentDialogue += ' ' + line.trim();
      }
    }
  });

  // Add the last dialogue if any
  if (currentDialogue) {
    dialogues.push(currentDialogue.trim());
  }

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

// Function to train the model
function trainModel(subtitleFiles, savePath) {
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

  // Save the model
  const json = net.toJSON();
  fs.writeFileSync(savePath, JSON.stringify(json));
}

// Export the trainModel function
module.exports = trainModel;
