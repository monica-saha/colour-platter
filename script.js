
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const paletteContainer = document.getElementById('paletteContainer');
    const paletteTypeBtns = document.querySelectorAll('.palette-type-btn');
    
    let currentPaletteType = 'random';
    
    // Initialize with a random palette
    generateRandomPalette();
    
    // Event listeners
    generateBtn.addEventListener('click', function() {
        if (currentPaletteType === 'random') {
            generateRandomPalette();
        } else {
            generateHarmonicPalette(currentPaletteType);
        }
    });
    
    paletteTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paletteTypeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set current palette type
            currentPaletteType = this.id.replace('Btn', '');
            
            // Generate new palette
            if (currentPaletteType === 'random') {
                generateRandomPalette();
            } else {
                generateHarmonicPalette(currentPaletteType);
            }
        });
    });
    
    // Generate a completely random palette
    function generateRandomPalette() {
        paletteContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const color = getRandomColor();
            createColorBox(color);
        }
    }
    
    // Generate harmonic color palette based on type
    function generateHarmonicPalette(type) {
        paletteContainer.innerHTML = '';
        const baseColor = getRandomColor();
        const colors = [];
        
        switch(type) {
            case 'complementary':
                colors.push(baseColor);
                colors.push(getComplementaryColor(baseColor));
                colors.push(adjustBrightness(baseColor, 20));
                colors.push(adjustBrightness(baseColor, -20));
                colors.push(adjustSaturation(baseColor, -30));
                break;
                
            case 'analogous':
                colors.push(baseColor);
                colors.push(adjustHue(baseColor, 30));
                colors.push(adjustHue(baseColor, -30));
                colors.push(adjustBrightness(baseColor, 15));
                colors.push(adjustBrightness(baseColor, -15));
                break;
                
            case 'triadic':
                colors.push(baseColor);
                colors.push(adjustHue(baseColor, 120));
                colors.push(adjustHue(baseColor, 240));
                colors.push(adjustBrightness(baseColor, 20));
                colors.push(adjustBrightness(baseColor, -20));
                break;
                
            case 'monochromatic':
                colors.push(baseColor);
                colors.push(adjustBrightness(baseColor, 20));
                colors.push(adjustBrightness(baseColor, 40));
                colors.push(adjustBrightness(baseColor, -20));
                colors.push(adjustBrightness(baseColor, -40));
                break;
        }
        
        colors.forEach(color => createColorBox(color));
    }
    
    // Create a color box element
    function createColorBox(color) {
        const colorElement = document.createElement('div');
        colorElement.className = 'text-center';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box h-64 rounded-lg shadow-md mb-2';
        colorBox.style.backgroundColor = color;
        
        const hexElement = document.createElement('div');
        hexElement.className = 'hex-code font-mono text-lg font-semibold';
        hexElement.textContent = color;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm transition relative';
        copyBtn.textContent = 'Copy';
        
        // Tooltip element
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Copied!';
        copyBtn.appendChild(tooltip);
        
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(color);
            
            // Show tooltip
            tooltip.classList.add('show');
            
            // Hide tooltip after 2 seconds
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 2000);
        });
        
        colorElement.appendChild(colorBox);
        colorElement.appendChild(hexElement);
        colorElement.appendChild(copyBtn);
        
        paletteContainer.appendChild(colorElement);
    }
    
    // Helper functions for color manipulation
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function getComplementaryColor(hex) {
        // Convert hex to RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        // Get complementary color
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    function adjustHue(hex, degrees) {
        // Convert hex to HSL
        let [h, s, l] = hexToHSL(hex);
        
        // Adjust hue
        h = (h + degrees) % 360;
        if (h < 0) h += 360;
        
        // Convert back to hex
        return hslToHex(h, s, l);
    }
    
    function adjustBrightness(hex, percent) {
        // Convert hex to HSL
        let [h, s, l] = hexToHSL(hex);
        
        // Adjust lightness
        l = Math.min(100, Math.max(0, l + percent));
        
        // Convert back to hex
        return hslToHex(h, s, l);
    }
    
    function adjustSaturation(hex, percent) {
        // Convert hex to HSL
        let [h, s, l] = hexToHSL(hex);
        
        // Adjust saturation
        s = Math.min(100, Math.max(0, s + percent));
        
        // Convert back to hex
        return hslToHex(h, s, l);
    }
    
    function hexToHSL(hex) {
        // Convert hex to RGB first
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;
        
        // Then to HSL
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    }
    
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    function toHex(value) {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
});