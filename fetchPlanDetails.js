import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base paths
const inputDir = join(__dirname, 'src/assets/JsonData/Web/AllLocalPlan');
const outputDir = join(__dirname, 'src/assets/JsonData/Web/JsonPlans');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to fetch plan details
async function fetchPlanDetails(planName) {
  const url = `https://api-doc.domain.com/Plan/Get_PlaneDetails?flag=5&plane_name=${encodeURIComponent(planName)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching details for plan "${planName}":`, error.message);
    return null;
  }
}

// Main function
async function processPlans() {
  try {
    // Read all files in the input directory
    const files = fs.readdirSync(inputDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = join(inputDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Extract plans
        if (jsonData.Plans && Array.isArray(jsonData.Plans)) {
          for (const plan of jsonData.Plans) {
            const planName = plan.PlanName;
            const sanitizedPlanName = planName.replace(/\s+/g, '-'); // Replace spaces with hyphens

            // Fetch plan details
            const planDetails = await fetchPlanDetails(sanitizedPlanName);
            if (planDetails) {
              // Save the response
              const outputFilePath = join(outputDir, `${sanitizedPlanName}.json`);
              fs.writeFileSync(outputFilePath, JSON.stringify(planDetails, null, 2));
              console.log(`✅ Successfully saved ${sanitizedPlanName}.json`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('🚨 Main error:', error.message);
  }
}

// Run the script
processPlans();