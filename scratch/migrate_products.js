const fs = require('fs');
const path = require('path');

const srcPath = 'c:\\Users\\alienware\\Desktop\\GAMAKAYSHOP\\GAMAKAYSHOP\\src\\lib\\products.ts';
const outputDir = 'c:\\Users\\alienware\\Desktop\\GAMAKAYSHOP\\GAMAKAYSHOP\\src\\data';
const outputPath = path.join(outputDir, 'products.json');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let content = fs.readFileSync(srcPath, 'utf8');

// Extract everything inside the sampleProducts array
const startMarker = 'export const sampleProducts: Product[] = [';
const startIdx = content.indexOf(startMarker) + startMarker.length - 1;
const endMarker = '\n];\n\n// Helper functions';
let endIdx = content.indexOf(endMarker);

if (endIdx === -1) {
    // try alternative end marker
    endIdx = content.lastIndexOf('];');
}

let arrayStr = content.substring(startIdx, endIdx + 1);

// Convert the string representation of a JS array to a real JSON string
// This is still tricky without a full parser, but let's try a better approach:
// Use Function() to evaluate the array literal safely (it's hardcoded data)

try {
    // We need to remove the trailing commas and handle potential TS syntax
    // But evaluating it as a JS expression is usually best for "data in code"
    // We just need to remove comments first
    const cleanArrayStr = arrayStr.replace(/\/\/.*$/gm, '');
    const products = new Function(`return ${cleanArrayStr}`)();
    
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 4), 'utf8');
    console.log(`Successfully created ${outputPath}`);
} catch (e) {
    console.error('Error:', e);
}
