const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const { askQuestion, silentExit } = require('./helpers');
const User = require('~/models/User');
const { savePreset } = require('~/models/Preset');
const connect = require('./connect');

(async () => {
  await connect();

  console.purple('------------------------');
  console.purple('Create a new preset!');
  console.purple('------------------------');

  if (process.argv.length < 4) {
    console.orange('Usage: npm run add-preset <username> <promptPrefix>');
    console.orange('Note: if you do not pass in the arguments, you will be prompted for them.');
    console.purple('------------------------');
  }

  let username = '';
  let promptPrefix = '';

  // Parse command line arguments
  if (process.argv.length >= 3) {
    username = process.argv[2];
  }
  if (process.argv.length >= 4) {
    promptPrefix = process.argv[3];
  }

  if (!username) {
    username = await askQuestion('Username:');
  }

  const user = await User.findOne({ username });
  if (!user) {
    console.red('Error: User not found!');
    silentExit(1);
  }

  if (!promptPrefix) {
    promptPrefix = await askQuestion('Prompt Prefix:');
  }

  if (!promptPrefix) {
    console.red('Error: Prompt prefix is required!');
    silentExit(1);
  }

  const preset = {
    presetId: Math.random().toString(36).substring(2),
    title: 'Custom Preset',
    promptPrefix,
    endpoint: 'openAI'
  };

  try {
    const result = await savePreset(user._id, preset);
    if (result.message) {
      console.red('Error: ' + result.message);
      silentExit(1);
    }
    console.green('Preset created successfully!');
    silentExit(0);
  } catch (error) {
    console.red('Error creating preset: ' + error.message);
    silentExit(1);
  }
})();

process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('There was an uncaught error:');
    console.error(err);
  }

  if (err.message.includes('fetch failed')) {
    return;
  } else {
    process.exit(1);
  }
});
