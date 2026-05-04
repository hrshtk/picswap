# Image Swapper Chrome Extension

This Chrome extension allows you to replace images on any live webpage with any local image. It uses a drag and drop interface to swap out visual elements without altering the page layout, shadows, or underlying CSS layers. 

## Features

* **Targeted Selection:** Hover over elements to highlight them and click to lock your selection.
* **Format Support:** Works with standard HTML `<img>` tags and CSS `background-image` properties. 
* **Drag and Drop:** Pull local files from your computer or drag image URLs from other browser tabs to replace the selected element.
* **Non-Destructive Styling:** Uses CSS outlines instead of borders to prevent layout shifts.

## Installation 

Since this is a custom extension, you need to load it into Chrome manually.

1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing the extension files.

## Usage

1. Pin the extension to your Chrome toolbar for easy access.
2. Navigate to the webpage you want to edit.
3. Click the extension icon and click **Start**. The cursor will change to a crosshair.
4. Hover over the image you want to change. An orange outline will appear.
5. Click the image. The outline will turn dashed green to indicate it is selected.
6. Drag a new image file from your computer and drop it anywhere on the page. The image will update.
7. Click the extension icon and click **Stop** to return the webpage to normal browsing mode.

## Files Included

* `manifest.json`: Extension configuration and permissions.
* `popup.html` & `popup.js`: User interface for the Start and Stop controls.
* `content.js`: Core logic for highlighting, selecting, and processing image replacements.
