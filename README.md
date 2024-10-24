
## Introduction

Building a Chrome extension that leverages AI technologies can significantly enhance user experience by adding powerful features directly into the browser.

In this tutorial, we'll cover the entire process of building a Chrome extension from scratch with AI/ML API, Deepgram Aura, and IndexDB, from setup to deployment. We'll start by setting up our development environment, including installing necessary tools and configuring our project. Then, we'll dive into the core components of our Chrome extension: manifest.json contains basic metadata about your extension, scripts.js responsible how our extension will behave, and styles.css to add some styling. We'll explore how integrate these technologies with Deepgram Aura through AI/ML API, and use IndexDB as temporary storage for generated audio file. Along the way, we'll discuss best practices for building Chrome extension, handling user queries, and saving data in the database. By the end of this tutorial, you'll have a solid foundation in building Chrome extension and be well-equipped to build any AI-powered Chrome extension.

Let's get a brief overview of technologies we are going to utilize.

### AI/ML API

AI/ML API is a game-changing platform for developers and SaaS entrepreneurs looking to integrate cutting-edge AI capabilities into their products. AI/ML API offers a single point of access to over 200 state-of-the-art AI models, covering everything from NLP to computer vision.

**Key Features for Developers:**
* Extensive Model Library: 200+ pre-trained models for rapid prototyping and deployment
* Customization Options: Fine-tune models to fit your specific use case
* Developer-Friendly Integration: RESTful APIs and SDKs for seamless incorporation into your stack
* Serverless Architecture: Focus on coding, not infrastructure management

> Deep Dive into AI/ML API Documentation; https://docs.aimlapi.com/

### Chrome Extension

Chrome extension is a small software program that modifies or enhances the functionality of the Google Chrome web browser. These extensions are built using web technologies such as HTML, CSS, and JavaScript, and are designed to serve a single purpose, making them easy to understand and use.

> Browse Chrome Web Store; https://chromewebstore.google.com/

### Deepgram Aura

Deepgram Aura is the first text-to-speech (TTS) AI model designed for real-time, conversational AI agents and applications. It delivers human-like voice quality with unparalleled speed and efficiency, making it a game-changer for building responsive, high-throughput voice AI experiences.

> Learn more about technical details; https://aimlapi.com/models/aura

### IndexDB
IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. IndexedDB is a JavaScript-based object-oriented database.
> Learn more about key concepts and usage; https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

## Getting Started with Chrome Extension
Building a Chrome extension involves understanding its structure, permissions, and how it interacts with web pages. We'll start by setting up our development environment and creating the foundational files required for our extension.

### Setting Up Your Development Environment
Before we begin coding, ensure you have the following:
* Chrome Browser: The browser where we'll load and test our extension.
* Text Editor or IDE: Tools like Visual Studio Code, Sublime Text, or Atom are suitable for editing code. We'll use Visual Studio Code in this tutorial.
* Basic Knowledge of HTML, CSS, and JavaScript: Familiarity with these technologies is essential for building Chrome extensions.

### Creating the Project Structure
A minimal Chrome extension requires at least three files:
* manifest.json: Contains metadata and configuration for the extension.
* scripts.js: Holds the JavaScript code that defines the extension's behavior.
* styles.css: Includes any styling for the extension's UI elements.

Let's create a directory for our project and set up these files.
**Step 1: Create a New Directory**
Open your terminal and run the following commands to create a new folder for your extension:
```
mkdir my-first-chrome-extension
cd my-first-chrome-extension
```
**Step 2: Create Essential Files**
Within the new directory, create the necessary files:
```
touch manifest.json
touch scripts.js
touch styles.css
```

### Understanding `manifest.json`
The `manifest.json` file is the heart of your Chrome extension. It tells the browser about your extension, what it does, and what permissions it needs. Let's delve into configuring this file properly.
```
{
  "manifest_version": 3,
  "name": "Read Aloud",
  "version": "1.0",
  "description": "Read Aloud anything in any tab",
  "host_permissions": [
    "*://*.aimlapi.com/*"
],
  "permissions": [
      "activeTab"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["scripts.js"],
      "css": ["styles.css"]
    }
  ],
  "icons": {
    "16": "icons/icon.png",
    "48": "icons/icon.png",
    "128": "icons/icon.png"
  }
}
```

### Essential Fields in `manifest.json`
At a minimum, manifest.json must include:
* manifest_version: Specifies the version of the manifest file format. Chrome currently uses version 3.
* name: The name of your extension, as it will appear to users.
* version: The version number of your extension, following semantic versioning.

### Adding Metadata and Permissions
Beyond the essential fields, we'll add:
* description: A brief summary of what your extension does.
* host_permissions: Specifies which domains the extension can access. For our integration with the `AI/ML API`, we'll need access to `*.aimlapi.com`.
* permissions: Declares special permissions needed, such as accessing the active tab.
* content_scripts: Defines scripts and styles to inject into web pages.
* icons: Provides icons for the extension at various sizes.

### Explanation of Key Fields
* manifest_version: Set to `3` to use the latest Chrome extension features.
* name: We'll name our extension "`Read Aloud`" reflecting its functionality.
* version: Starting with "`1.0`" indicates the initial release.
* description: "`Read Aloud anything in any tab`" informs users about the extension's purpose.
* host_permissions: The wildcard `*://*.aimlapi.com/`* allows the extension to communicate with any subdomain of `aimlapi.com`, necessary for API calls.
* permissions: "`activeTab`" allows the extension to interact with the content of the current tab.
* content_scripts: Specifies that `scripts.js` and `styles.css` should be injected into all web pages ("`<all_urls>`").
* icons: References icon files for the extension (ensure you have appropriate icon files in an `icons` directory).

### Generating icon
Open your browser and go to `chatgpt.com`. Now let's generate icon for our Chrome extension. We'll use one icon for different sizes (it's totally ok).

Enter the following prompt:

> Generate black and white icon for my "Read Aloud" Chrome extension. This extension allows users to highlight the specific text in the website and listen to it. It's AI-powered Chrome extension. The background should be in white and solid.

Wait a couple of seconds until ChatGPT generates the icon (image). Click download and rename it to `icon.png`. Then put inside `icons` folder.

### Finalizing `manifest.json`
With all fields properly defined, your `manifest.json` will enable browser to understand and correctly load your extension.

---

### Developing `scripts.js`
The `scripts.js` file contains the logic that controls how your extension behaves. We'll outline the key functionalities your script needs to implement.

### Variables and Initialization

Start by setting up necessary variables:
* API Key: You'll need an API key from the `AI/ML API` platform to authenticate your requests.
* Overlay Elements: Create DOM elements for the overlay and the "Read Aloud" button.
* Selection Variables: Store information about the user's selected text and its position.
```
// Set your AIML_API_KEY key
const AIML_API_KEY = ''; // Replace with your AIML_API_KEY key

// Create the overlay
const overlay = document.createElement('div');
overlay.id = 'read-aloud-overlay';

// Create the "Read Aloud" button
const askButton = document.createElement('button');
askButton.id = 'read-aloud-button';
askButton.innerText = 'Read Aloud';

// Append the button to the overlay
overlay.appendChild(askButton);

// Variables to store selected text and range
let selectedText = '';
let selectedRange = null;
```

### Handling Text Selection

Your extension should detect when a user selects text on a webpage:
* Event Listener: Attach a `mouseup` event listener to the document to detect when the user finishes selecting text.
```
document.addEventListener('mouseup', (event) => {
  console.log('mouseup event: ', event);
  //...code
}
```
* Selection Detection: Check if the selected text is not empty and store it.
```
const selection = window.getSelection();
const text = selection.toString().trim();
if (text !== '') {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
```
* Overlay Positioning: Calculate where to place the overlay so it's near the selected text.
```
// Set the position of the overlay
overlay.style.top = `${window.scrollY + rect.top - 50}px`; // Adjust as needed
overlay.style.left = `${window.scrollX + rect.left + rect.width / 2 - 70}px`; // Adjust to center the overlay

selectedText = text;
selectedRange = range;
```
* Overlay Management: Ensure that any existing overlay is removed before adding a new one.
```
// Remove existing overlay if any
const existingOverlay = document.getElementById('read-aloud-overlay');
if (existingOverlay) {
  existingOverlay.remove();
}

// Append the overlay to the document body
document.body.appendChild(overlay);
} else {
  // Remove overlay if no text is selected
  const existingOverlay = document.getElementById('read-aloud-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
}
```
### Full Code:
```
// Function to handle text selection
document.addEventListener('mouseup', (event) => {
  console.log('mouseup event: ', event);
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (text !== '') {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Set the position of the overlay
    overlay.style.top = `${window.scrollY + rect.top - 50}px`; // Adjust as needed
    overlay.style.left = `${window.scrollX + rect.left + rect.width / 2 - 70}px`; // Adjust to center the overlay

    selectedText = text;
    selectedRange = range;

    // Remove existing overlay if any
    const existingOverlay = document.getElementById('read-aloud-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Append the overlay to the document body
    document.body.appendChild(overlay);
  } else {
    // Remove overlay if no text is selected
    const existingOverlay = document.getElementById('read-aloud-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
  }
});
```
### Interacting with the AI/ML API
When the user clicks the "Read Aloud" button:
* Input Validation: Check if the selected text meets any length requirements.
```
if (selectedText.length > 200) {
// ...code
}
```
* Disable Button: Prevent multiple clicks by disabling the button during processing.
```
// Disable the button
askButton.disabled = true;
askButton.innerText = 'Loading...';
```
* API Request: Send a POST request to the AI/ML API with the selected text for text-to-speech conversion.
```
// Send the selected text to your AI/ML API for TTS
const response = await fetch('https://api.aimlapi.com/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AIML_API_KEY}`, // Replace with your actual API key
  },
  body: JSON.stringify({
    model: '#g1_aura-asteria-en',  // Replace with your specific model if needed
    text: selectedText
  })
});
```
* Error Handling: Handle any errors that occur during the API request gracefully.
```
try {

  // ...code

  if (!response.ok) {
    throw new Error('API request failed');
  }

  // ...code

} catch (error) {
  console.error('Error:', error);
  askButton.disabled = false;
  askButton.innerText = 'Read Aloud';
  alert('An error occurred while fetching the audio.');
}
```
* Audio Playback: Once the audio is received, play it back to the user.
```
// Play the audio
audio.play();
```
### Using IndexedDB for Storage
To manage audio files efficiently:
* Open Database: Create or open an IndexedDB database to store audio blobs.
```
// Open IndexedDB
const db = await openDatabase();
const audioId = 'audio_' + Date.now(); // Generate a unique ID for the audio
```
* Save Audio: Store the audio blob in IndexedDB after receiving it from the API.
```
// Save audio blob to IndexedDB
await saveAudioToIndexedDB(db, audioId, audioBlob);
```
* Retrieve Audio: Fetch the audio blob from IndexedDB for playback.
```
// Retrieve audio blob from IndexedDB
const retrievedAudioBlob = await getAudioFromIndexedDB(db, audioId);

// Create an object URL for the audio and play it
const audioURL = URL.createObjectURL(retrievedAudioBlob);
const audio = new Audio(audioURL);

// Play the audio
audio.play();
```
* Delete Audio: Remove the audio blob from the database after playback to free up space.
```
// After the audio has finished playing, delete it from IndexedDB
audio.addEventListener('ended', async () => {
  // Revoke the object URL
  URL.revokeObjectURL(audioURL);

  // Delete the audio from IndexedDB
  await deleteAudioFromIndexedDB(db, audioId);
  console.log('Audio deleted from IndexedDB after playback.');
});
```
### Cleanup and User Experience

* Overlay Removal: Remove the overlay if the user clicks elsewhere or deselects the text.

```
// Remove overlay when clicking elsewhere
document.addEventListener('mousedown', (event) => {
  const overlayElement = document.getElementById('read-aloud-overlay');
  if (overlayElement && !overlayElement.contains(event.target)) {
    overlayElement.remove();
    window.getSelection().removeAllRanges();
  }
});
```
* Re-enable Button: Ensure the "Read Aloud" button is re-enabled after processing is complete.
* User Feedback: Provide visual cues, like changing button text to "Loading…", to inform the user that processing is underway.

### Full code:
```
// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Handle click on "Read Aloud" button using event delegation
document.body.addEventListener('click', async (event) => {
  if (selectedText.length > 200) {
    console.log('selectedText: ', selectedText);
    event.stopPropagation();

    // Disable the button
    askButton.disabled = true;
    askButton.innerText = 'Loading...';

    try {
      // Delay before sending the request (if needed)
      await delay(3000);

      // Send the selected text to your AI/ML API for TTS
      const response = await fetch('https://api.aimlapi.com/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AIML_API_KEY}`, // Replace with your actual API key
        },
        body: JSON.stringify({
          model: '#g1_aura-asteria-en',  // Replace with your specific model if needed
          text: selectedText
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // Get the audio data as a blob
      const audioBlob = await response.blob();
      console.log('Audio blob:', audioBlob);

      // Open IndexedDB
      const db = await openDatabase();
      const audioId = 'audio_' + Date.now(); // Generate a unique ID for the audio

      // Save audio blob to IndexedDB
      await saveAudioToIndexedDB(db, audioId, audioBlob);

      // Retrieve audio blob from IndexedDB
      const retrievedAudioBlob = await getAudioFromIndexedDB(db, audioId);

      // Create an object URL for the audio and play it
      const audioURL = URL.createObjectURL(retrievedAudioBlob);
      const audio = new Audio(audioURL);

      // Play the audio
      audio.play();

      // After the audio has finished playing, delete it from IndexedDB
      audio.addEventListener('ended', async () => {
        // Revoke the object URL
        URL.revokeObjectURL(audioURL);

        // Delete the audio from IndexedDB
        await deleteAudioFromIndexedDB(db, audioId);
        console.log('Audio deleted from IndexedDB after playback.');
      });

      // Re-enable the button
      askButton.disabled = false;
      askButton.innerText = 'Read Aloud';
    } catch (error) {
      console.error('Error:', error);
      askButton.disabled = false;
      askButton.innerText = 'Read Aloud';
      alert('An error occurred while fetching the audio.');
    }
  }
});
```
---

### Implementing IndexedDB Functions
IndexedDB is a powerful client-side storage system that allows us to store large amounts of data, including files and blobs.

### Functionality to Implement
You'll need to create four primary functions to interact with IndexedDB:

* `openDatabase():` Opens a connection to the database and creates an object store if it doesn't exist.
```
// Function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('audioDatabase', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('audios', { keyPath: 'id' });
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
```
* `saveAudioToIndexedDB():` Saves the audio blob with a unique ID.
```
// Function to save audio blob to IndexedDB
function saveAudioToIndexedDB(db, id, blob) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audios'], 'readwrite');
    const store = transaction.objectStore('audios');
    const request = store.put({ id: id, audio: blob });
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
```
* `getAudioFromIndexedDB():` Retrieves the audio blob using its ID.
```
// Function to get audio blob from IndexedDB
function getAudioFromIndexedDB(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audios'], 'readonly');
    const store = transaction.objectStore('audios');
    const request = store.get(id);
    request.onsuccess = (event) => {
      if (request.result) {
        resolve(request.result.audio);
      } else {
        reject('Audio not found in IndexedDB');
      }
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
```
* deleteAudioFromIndexedDB(): Deletes the audio blob after playback.
```
// Function to delete audio from IndexedDB
function deleteAudioFromIndexedDB(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audios'], 'readwrite');
    const store = transaction.objectStore('audios');
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
```
### Key Concepts
* Transactions: All interactions with IndexedDB occur within a transaction. Ensure you specify the correct transaction mode (`readonly` or `readwrite`).
* Object Stores: Similar to tables in SQL databases, object stores hold the data. We'll use an object store named "`audios`".
* Error Handling: Always handle errors for database operations to prevent unexpected behavior.

---

### Styling with `styles.css`
To provide a seamless user experience, your extension should have a clean and intuitive interface.
### Styling the Overlay and Button
Define styles for:
* Overlay Positioning: Absolute positioning to place the overlay near the selected text.
```
#read-aloud-overlay {
  cursor: pointer;
  position: absolute;
  width: 140px;
  height: 40px;
  border-radius: 4px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  box-sizing: border-box;
}
```
* Button Appearance: Styling the "Read Aloud" button to match the overlay and be easily clickable.
```
#read-aloud-button {
  color: #fff;
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
```
* Hover Effects: Enhance user interaction with hover effects on the button.
```
#read-aloud-button:hover {
  color: #000;
  padding: 5px 10px;
  border-radius: 4px;
}
```
* Disabled State: Visually indicate when the button is disabled.
```
#read-aloud-button:disabled {
  color: #aaa;
  cursor: default;
}
```
---

### Obtaining and Setting Your API Key
To interact with the AI/ML API and Deepgram Aura model, you'll need an API key.
### Steps to Obtain Your API Key
* Visit the AI/ML API Platform: Navigate to *aimlapi.com*.

<img goes here>
Official website of aimlapi.com

* Sign In: Click "`Get API Key`" and sign in using your Google account.

<img goes here>
Sign In page of aimlapi.com

* Access the Dashboard: After signing in, you'll be redirected to your dashboard.

<img goes here>
User dashboard of aimlapi.com | Playground

* Create an API Key: Go to the "Key Management" tab and click "Create API Key."

<img goes here>
User dashboard of aimlapi.com | API Key Management

* Copy the API Key: Once generated, copy your API key.

<img goes here>
User dashboard of aimlapi.com | API Key Management

### Setting the API Key in Your Extension
* Security Note: Never hardcode your API key into your scripts if you plan to distribute your extension. Consider using environment variables or prompting the user to enter their API key.
```
touch .env
```
Now put your API Key:
```
AIML_API_KEY=put_your_api_key_here
```
But it won't work instantly. Using `.env` in Chrome extensions requires other extra configurations. We'll talk about this in upcoming tutorials.
* For Testing: In your `scripts.js`, assign your API key to the variable handling authentication for API requests.
```
// Set your AIML_API_KEY key
const AIML_API_KEY = ''; // Replace with your AIML_API_KEY key
```
---

### Running and Testing the Extension
With all components in place, it's time to load your extension into Chrome browser and see it in action.

### Loading the Extension
* Open Extensions Page: In Chrome, navigate to `chrome://extensions/`.
<img goes here>
Load unpacked

Enable Developer Mode: Toggle the "`Developer mode`" switch in the top right corner.
<img goes here>
Select the Chrome extension folder

* Load Unpacked Extension: Click "`Load unpacked`" and select your `my-first-chrome-extension` folder. (p.s. in my case it's `aimlapi-tutorial-one`).
<img goes here>
Your Chrome extension

* Verify Installation: The extension should now appear in the list with its name and icon.

### Testing Functionality
* Navigate to a Webpage: Open a webpage with textual content, such as an article or blog post.
* Select Text: Highlight a paragraph or sentence.
* Interact with the Overlay: The "`Loading…`" overlay should appear above the selected text. Wait a couple of seconds while initiating the text-to-speech process.
* Listen: After a brief processing period, you should hear the text read aloud by the AI voice.

### Troubleshooting Tips
* Overlay Doesn't Appear: Check if `content_scripts` are correctly specified in `manifest.json`.
* No Audio Playback: Verify your API key is correctly set and that API requests are successful.
* Console Errors: Use the browser's developer tools to inspect any JavaScript errors or network issues.

---

### Project Summary
In this tutorial, we've:

* Set Up the Development Environment: Created the necessary project structure and files for a Chrome extension.
* Configured `manifest.json`: Defined essential metadata and permissions, understanding the importance of each field.
* Developed `scripts.js`: Outlined the logic for handling text selection, interacting with the AI/ML API, and managing audio playback.
* Implemented IndexedDB Integration: Learned how to use IndexedDB for storing and retrieving audio files locally.
* Styled the Extension with `styles.css`: Applied CSS to enhance the user interface and improve user experience.
* Obtained and Set Up an API Key: Acquired an API key from the AI/ML API platform and integrated it securely into our extension.
* Loaded and Tested the Extension: Deployed the extension in Chrome and validated its functionality on live web pages.
* Discussed Best Practices: Emphasized the importance of security, user experience, and error handling in extension development.

---

### Next Steps
With a solid foundation, you can enhance your extension further:
* Add Customization Options: Allow users to choose different voices or languages.
* Improve Error Handling: Provide user-friendly messages and fallback options if the API is unavailable.
* Optimize Performance: Implement caching strategies or optimize API requests to reduce latency.
* Publish Your Extension: Share your creation with others by publishing it on the Chrome Web Store.
<img goes here>
Official Chrome Web Store page https://chromewebstore.google.com/

---

### Conclusion
Congratulations on building a Chrome extension that integrates advanced AI capabilities! This project showcases how combining web technologies with powerful APIs can create engaging and accessible user experiences. You're now equipped with the knowledge to develop and expand upon this extension or create entirely new ones that leverage AI/ML APIs.

> Full implementation available on Github; https://github.com/TechWithAbee/Building-a-Chrome-Extension-from-Scratch-with-AI-ML-API-Deepgram-Aura-and-IndexDB-Integration

---

Should you have any questions or need further assistance, don't hesitate to reach out via email at `abdibrokhim@gmail.com`.