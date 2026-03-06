const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

async function generateFavicon() {
    const inputPath = path.join(__dirname, 'public', 'gamakay-logo.png');
    const tempPngPath = path.join(__dirname, 'public', 'temp-favicon.png');
    const outputPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

    // Get metadata to crop the controller part
    const meta = await sharp(inputPath).metadata();
    const w = meta.width;
    const h = meta.height;

    // Tighter crop to just the controller
    const croppedBuffer = await sharp(inputPath)
        .extract({
            left: Math.round(w * 0.22),
            top: Math.round(h * 0.04),
            width: Math.round(w * 0.56),
            height: Math.round(h * 0.35)
        })
        .png()
        .toBuffer();

    // Negate to make it white, and pad to a square
    await sharp(croppedBuffer)
        .trim()
        .negate({ alpha: false }) // Make it white
        // Now resize it to fit into 256x256 perfectly centered
        .resize({
            width: 256,
            height: 256,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(tempPngPath);

    console.log('PNG generated. Converting to ICO...');

    // Convert to proper .ico format
    const buf = await pngToIco(tempPngPath);
    fs.writeFileSync(outputPath, buf);

    // Clean up temporary file
    fs.unlinkSync(tempPngPath);
    console.log('True favicon.ico generated at', outputPath);
}

generateFavicon().catch(console.error);
