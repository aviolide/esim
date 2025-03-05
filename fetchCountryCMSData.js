import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function fetchCountryCMSData() {
  try {
    // Read country list
    const countries = JSON.parse(fs.readFileSync(
      './src/assets/JsonData/Web/CountryList/Country.json',
      'utf-8'
    ));

    // Create output directory if it doesn't exist
    const outputDir = './src/assets/JsonData/CMS';
    fs.mkdirSync(outputDir, { recursive: true });

    for (const country of countries) {
      const countryId = country.countryid;
      const fileName = `${countryId}.json`;
      
      try {
        // Fetch country CMS data
        const response = await fetch(
          `https://api-doc.domain.com/plan/getcountry_cms?flag=1&countryid=${countryId}`
        );

        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

        const data = await response.json();
        
        // Save file
        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully saved ${fileName}`);
      } catch (error) {
        console.error(`❌ Error processing country ID ${countryId}:`, error.message);
      }
    }
  } catch (error) {
    console.error('🚨 Main error:', error);
  }
}

fetchCountryCMSData();