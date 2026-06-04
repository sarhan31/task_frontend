import { Jimp } from 'jimp';

async function removeBackground() {
    try {
        const image = await Jimp.read('public/logotask_manager.png');
        
        // Get the color of the top-left pixel to assume as background
        const bgColor = image.getPixelColor(0, 0);
        const bgR = (bgColor >> 24) & 255;
        const bgG = (bgColor >> 16) & 255;
        const bgB = (bgColor >> 8) & 255;
        
        const tolerance = 40; // Allow slight variations in the background color

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            // If the pixel is close to the background color, make it transparent
            if (
                Math.abs(r - bgR) <= tolerance &&
                Math.abs(g - bgG) <= tolerance &&
                Math.abs(b - bgB) <= tolerance
            ) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        await image.write('public/logotask_manager.png');
        console.log('Background removed successfully.');
    } catch (err) {
        console.error('Error:', err);
    }
}

removeBackground();
