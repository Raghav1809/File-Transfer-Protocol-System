// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    initializeMatrixBackground();
    document.getElementById('text').addEventListener('input', updateCharCount);
});

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = 
        now.toLocaleTimeString('en-US', { hour12: false });
}

function updateCharCount() {
    const text = document.getElementById('text').value;
    document.getElementById('charCount').textContent = text.length;
}

function processEncryption() {
    const mode = document.getElementById('encryptionMode').value;
    let result;
    
    switch(mode) {
        case 'reverse':
            result = reverseEncrypt();
            break;
        case 'double':
            result = doubleEncrypt();
            break;
        case 'random':
            result = quantumEncrypt();
            break;
        default:
            result = standardEncrypt();
    }
    
    displayResult(result);
    showEncryptionAnimation();
}

function processDecryption() {
    const mode = document.getElementById('encryptionMode').value;
    let result;
    
    switch(mode) {
        case 'reverse':
            result = reverseDecrypt();
            break;
        case 'double':
            result = doubleDecrypt();
            break;
        case 'random':
            result = quantumDecrypt();
            break;
        default:
            result = standardDecrypt();
    }
    
    displayResult(result);
    showDecryptionAnimation();
}

function standardEncrypt() {
    const text = document.getElementById('text').value;
    const key = parseInt(document.getElementById('key').value);
    
    if (!text || isNaN(key)) {
        return '⚠️ INVALID INPUT PARAMETERS';
    }
    
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + key) % 26) + 65);
            }
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + key) % 26) + 97);
            }
        }
        return char;
    }).join('');
}

function standardDecrypt() {
    const text = document.getElementById('text').value;
    const key = parseInt(document.getElementById('key').value);
    
    if (!text || isNaN(key)) {
        return '⚠️ INVALID INPUT PARAMETERS';
    }
    
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 - key + 26) % 26) + 65);
            }
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 - key + 26) % 26) + 97);
            }
        }
        return char;
    }).join('');
}

function reverseEncrypt() {
    const result = standardEncrypt();
    return result.split('').reverse().join('');
}

function reverseDecrypt() {
    const text = document.getElementById('text').value;
    return standardDecrypt(text.split('').reverse().join(''));
}

function doubleEncrypt() {
    const firstPass = standardEncrypt();
    const key = parseInt(document.getElementById('key').value);
    return standardEncrypt(firstPass, key * 2);
}

function doubleDecrypt() {
    const text = document.getElementById('text').value;
    const key = parseInt(document.getElementById('key').value);
    const firstPass = standardDecrypt(text, key * 2);
    return standardDecrypt(firstPass, key);
}

function quantumEncrypt() {
    const text = document.getElementById('text').value;
    const key = parseInt(document.getElementById('key').value);
    const quantumNoise = Math.floor(Math.random() * 10) + 1;
    const quantumKey = (key * quantumNoise) % 26;
    
    return `[QK${quantumNoise}]` + standardEncrypt(text, quantumKey);
}

function quantumDecrypt() {
    const text = document.getElementById('text').value;
    const key = parseInt(document.getElementById('key').value);
    
    if (text.startsWith('[QK')) {
        const quantumNoise = parseInt(text.substring(3, text.indexOf(']')));
        const quantumKey = (key * quantumNoise) % 26;
        const ciphertext = text.substring(text.indexOf(']') + 1);
        return standardDecrypt(ciphertext, quantumKey);
    }
    return '⚠️ INVALID QUANTUM SIGNATURE';
}

function analyzeText() {
    const text = document.getElementById('text').value;
    const analysisPanel = document.getElementById('analysisPanel');
    
    const analysis = {
        length: text.length,
        words: text.split(/\s+/).length,
        uppercase: (text.match(/[A-Z]/g) || []).length,
        lowercase: (text.match(/[a-z]/g) || []).length,
        numbers: (text.match(/[0-9]/g) || []).length,
        spaces: (text.match(/\s/g) || []).length,
        special: (text.match(/[^A-Za-z0-9\s]/g) || []).length,
        entropy: calculateEntropy(text)
    };

    analysisPanel.innerHTML = `
        <h4>QUANTUM ANALYSIS MATRIX</h4>
        <div class="analysis-grid">
            <div>Characters: ${analysis.length}</div>
            <div>Words: ${analysis.words}</div>
            <div>Uppercase: ${analysis.uppercase}</div>
            <div>Lowercase: ${analysis.lowercase}</div>
            <div>Numbers: ${analysis.numbers}</div>
            <div>Special: ${analysis.special}</div>
            <div>Entropy: ${analysis.entropy.toFixed(2)} bits</div>
        </div>
    `;
    
    analysisPanel.style.display = 'block';
    showAnalysisAnimation();
}

function calculateEntropy(text) {
    const freq = {};
    text.split('').forEach(char => freq[char] = (freq[char] || 0) + 1);
    
    return Object.values(freq).reduce((entropy, count) => {
        const p = count / text.length;
        return entropy - (p * Math.log2(p));
    }, 0);
}

function showEncryptionAnimation() {
    const output = document.getElementById('output');
    output.style.animation = 'glitch 0.5s ease';
    setTimeout(() => output.style.animation = '', 500);
}

function showDecryptionAnimation() {
    const output = document.getElementById('output');
    output.style.animation = 'decrypt 0.5s ease';
    setTimeout(() => output.style.animation = '', 500);
}

function showAnalysisAnimation() {
    const panel = document.getElementById('analysisPanel');
    panel.style.animation = 'slideIn 0.5s ease';
    setTimeout(() => panel.style.animation = '', 500);
}

function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(() => {
        displayNotification('DATA COPIED TO QUANTUM BUFFER');
    });
}

function downloadResult() {
    const output = document.getElementById('output').textContent;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_cipher_${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    displayNotification('FILE DOWNLOADED TO LOCAL MATRIX');
}

function displayNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cyber-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function displayResult(result) {
    const output = document.getElementById('output');
    output.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < result.length) {
            output.textContent += result.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    }
    
    typeWriter();
}

function initializeMatrixBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const fontSize = 10;
    const columns = canvas.width/fontSize;
    const drops = [];
    
    for(let x = 0; x < columns; x++)
        drops[x] = 1;
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random()*matrix.length)];
            ctx.fillText(text, i*fontSize, drops[i]*fontSize);
            if(drops[i]*fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}
