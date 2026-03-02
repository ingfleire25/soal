let currentCaptcha = '';
let captchaTimeout = null;
function handleCaptchaFocus() {
    if(!currentCaptcha) {
        generateNewCaptcha(false);
    }
}
function generateNewCaptcha(userInitiated) {
    // Clear existing timeout
    if(captchaTimeout) {
        clearTimeout(captchaTimeout);
    }
    // Generate CAPTCHA
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters
    const captchaLength = 6;
    let newCaptcha = '';
    for(let i = 0; i < captchaLength; i++) {
        newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = newCaptcha;    
    // Show watermark
    const watermark = document.getElementById('captcha-watermark');
    watermark.textContent = newCaptcha;
    watermark.style.display = 'block';
    // Reset input field if user clicked refresh icon
    if(userInitiated) {
        document.getElementById('captcha').value = '';
    }   
    // Set timeout to hide watermark
    captchaTimeout = setTimeout(() => {
        watermark.style.display = 'none';
    }, 30000);
}
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission to handle form validation first
    const indicator = document.getElementById('indicador').value;
    const password = document.getElementById('clave').value;
    const enteredCaptcha = document.getElementById('captcha').value.trim();
    const errorElement = document.getElementById('captcha-error');
    const audio = new Audio('../icons/gs.flac');
    if (!currentCaptcha) {
        errorElement.textContent = 'Please generate a CAPTCHA first!';
        errorElement.style.display = 'block';
        return;
    }
    if (enteredCaptcha.toUpperCase() !== currentCaptcha.toUpperCase()) {
        errorElement.textContent = 'Invalid CAPTCHA! Click the icon to get a new one.';
        errorElement.style.display = 'block';
        document.getElementById('captcha').classList.add('is-invalid');
        generateNewCaptcha(true);
        setTimeout(() => {
            // Reload the page on wrong CAPTCHA
            window.location.reload();
        }, 3000); // Adjust timing as needed
        return;
    }
    // Check for valid credentials
    if (indicator === 'ñigre' && password === 'pingüiño]') {
        const icons = document.querySelectorAll('.icon-input');
        icons.forEach(icon => {
            icon.classList.add('move-right');
        });
        audio.play();
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } else {
        window.location.href = '../index.html'; // Redirect if invalid credentials
    }
});
