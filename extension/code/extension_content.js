// extension_content.js

console.log("Zonebourse Surgical Fixer Started");

// --- CONFIGURATION ---
const TARGET_SELECTORS = [
    // 1. The Dynamic Popup (Matches id="modal-portal-gy1bd9", "modal-portal-abc123", etc.)
    "[id^='modal-portal-']", 

    // 2. The Background/Overlay (if it's separate)
    // If the dark background is a different element, add its class or ID here.
    // Common examples: ".ReactModal__Overlay", ".overlay-backdrop"
    // If the popup includes the background, you can leave this empty or remove it.
    ".modal_backdrop" 
];

function cleanPage() {
    let elementsRemoved = 0;

    TARGET_SELECTORS.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.remove();
            elementsRemoved++;
        });
    });

    if (elementsRemoved > 0) {
        console.log(`Cleaned ${elementsRemoved} items.`);
        unlockScroll();
    }
}

function unlockScroll() {
    document.documentElement.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("position", "static", "important");
    document.body.style.setProperty("overflow", "auto", "important");
    document.body.style.setProperty("position", "static", "important");
}

// Run immediately
cleanPage();

// Run periodically to catch late loaders
const intervalId = setInterval(() => {
    cleanPage();
}, 500);

// Observer for persistent monitoring
const observer = new MutationObserver((mutations) => {
    cleanPage();
});
observer.observe(document.body, { childList: true, subtree: true });