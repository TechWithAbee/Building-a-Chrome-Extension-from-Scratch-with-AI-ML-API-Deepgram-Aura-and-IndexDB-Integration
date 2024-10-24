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


// Remove overlay when clicking elsewhere
document.addEventListener('mousedown', (event) => {
  const overlayElement = document.getElementById('read-aloud-overlay');
  if (overlayElement && !overlayElement.contains(event.target)) {
    overlayElement.remove();
    window.getSelection().removeAllRanges();
  }
});

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