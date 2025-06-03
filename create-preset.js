const fs = require('fs');
const preset = JSON.parse(fs.readFileSync('preset.json', 'utf8'));

const getJWT = async () => {
  try {
    const response = await fetch('http://localhost:3090/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'cosmo@example.com',
        password: 'W3LoveCosmo'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting JWT:', error);
    throw error;
  }
};

const createPreset = async () => {
  const jwt = await getJWT();
  try {
    const response = await fetch('http://localhost:3090/api/presets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(preset)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data?.presetId ?? "");
  } catch (error) {
    console.error('Error creating preset:', error);
    throw error;
  }
};

createPreset();



