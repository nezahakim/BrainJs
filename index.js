const tf = require('@tensorflow/tfjs-node');
const { pipeline } = require('@xenova/transformers');

// Load the pre-trained GPT-2 model and tokenizer
async function loadModel() {
  const generator = await pipeline('text-generation', 'gpt2');
  return generator;
}

// Generate text using the loaded model
async function generateText(generator, prompt, maxLength) {
  const output = await generator(prompt, {
    max_length: maxLength,
    temperature: 0.7,
    top_p: 0.9,
    do_sample: true,
  });

  return output[0].generated_text;
}

// Main function to run the text generation
async function main() {
  const generator = await loadModel();
  const prompt = "Once upon a time";
  const maxLength = 50;

  const generatedText = await generateText(generator, prompt, maxLength);
  console.log(generatedText);
}

main();
