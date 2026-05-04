let isActive = false;
let selectedElement = null;

// Listen for Start/Stop commands from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start") {
        isActive = true;
        document.body.style.cursor = 'crosshair';
    } else if (request.action === "stop") {
        isActive = false;
        document.body.style.cursor = 'default';
        clearSelection();
    }
});

// Inject CSS for highlighting images without breaking layout/shadows
const style = document.createElement('style');
style.innerHTML = `
    .img-swap-hover { outline: 3px solid #ff9800 !important; outline-offset: -3px; cursor: pointer !important; }
    .img-swap-selected { outline: 4px dashed #4CAF50 !important; outline-offset: -4px; }
`;
document.head.appendChild(style);

function hasBackgroundImage(element) {
    const style = window.getComputedStyle(element);
    return style.backgroundImage && style.backgroundImage !== 'none';
}

function clearSelection() {
    if (selectedElement) {
        selectedElement.classList.remove('img-swap-selected');
        selectedElement = null;
    }
    document.querySelectorAll('.img-swap-hover').forEach(el => el.classList.remove('img-swap-hover'));
}

// Hover effect
document.addEventListener('mouseover', (e) => {
    if (!isActive) return;
    const el = e.target;
    if (el.tagName.toLowerCase() === 'img' || hasBackgroundImage(el)) {
        el.classList.add('img-swap-hover');
    }
});

document.addEventListener('mouseout', (e) => {
    if (!isActive) return;
    e.target.classList.remove('img-swap-hover');
});

// Selection logic
document.addEventListener('click', (e) => {
    if (!isActive) return;
    const el = e.target;

    if (el.tagName.toLowerCase() === 'img' || hasBackgroundImage(el)) {
        e.preventDefault();
        e.stopPropagation();

        if (selectedElement) {
            selectedElement.classList.remove('img-swap-selected');
        }

        selectedElement = el;
        selectedElement.classList.remove('img-swap-hover');
        selectedElement.classList.add('img-swap-selected');
    }
}, true); // Use capture phase to prevent normal click actions (like opening links)

// Drag and Drop Logic
document.addEventListener('dragover', (e) => {
    // Only allow dropping if the extension is active and an image is selected
    if (isActive && selectedElement) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (!isActive || !selectedElement) return;

    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];

    // Process local files dropped from the computer
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            applyNewImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
    // Process image URLs dragged from another browser tab
    else {
        const html = e.dataTransfer.getData('text/html');
        const match = html && html.match(/src\s*=\s*"([^"]+)"/);
        let url = match ? match[1] : e.dataTransfer.getData('text/plain');

        if (url) {
            applyNewImage(url);
        }
    }
});

function applyNewImage(newImageSrc) {
    if (selectedElement.tagName.toLowerCase() === 'img') {
        selectedElement.src = newImageSrc;
        // Remove srcset, otherwise the browser might still load the original responsive image
        selectedElement.removeAttribute('srcset');
    } else {
        selectedElement.style.backgroundImage = `url('${newImageSrc}')`;
    }
}