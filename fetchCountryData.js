import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function fetchCountryData() {
  try {
    // Read country list
    const countries = JSON.parse(fs.readFileSync(
      './src/assets/JsonData/Web/CountryList/Country.json',
      'utf-8'
    ));

    // Create output directory if it doesn't exist
    const outputDir = './src/assets/JsonData/Web/AllLocalPlan';
    fs.mkdirSync(outputDir, { recursive: true });

    for (const country of countries) {
      const countryName = country.CountryName;
      const fileName = `${countryName}.json`;
      
      try {
        // Fetch country data
        const response = await fetch(
          `https://admin.domain.com/JsonData/Web/AllLocalPlan/${encodeURIComponent(countryName)}.json`
        );

        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

        const data = await response.json();
        
        // Save file
        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully saved ${fileName}`);
      } catch (error) {
        console.error(`❌ Error processing ${countryName}:`, error.message);
      }
    }
  } catch (error) {
    console.error('🚨 Main error:', error);
  }
}

fetchCountryData();