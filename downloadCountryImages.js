import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const countryListPath = path.join(__dirname, 'src/assets/JsonData/Web/CountryList/Country.json');
const flagOutputDir = path.join(__dirname, 'src/assets/countryflag');
const bannerOutputDir = path.join(__dirname, 'src/assets/countrybanner');

// Function to download and save an image
async function downloadImage(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Successfully saved ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error downloading ${url}:`, error.message);
  }
}

// Main function
async function processCountries() {
  try {
    // Read the country list
    const countryList = JSON.parse(fs.readFileSync(countryListPath, 'utf-8'));

    for (const country of countryList) {
      const { flagimage, countryimage, CountryName } = country;

      // Download flag image
      if (flagimage) {
        const flagUrl = `https://domain.com${flagimage}`;
        const flagOutputPath = path.join(flagOutputDir, `${CountryName}.png`);
        await downloadImage(flagUrl, flagOutputPath);
      }

    }
  } catch (error) {
    console.error('🚨 Main error:', error.message);
  }
}

// Run the script
processCountries();