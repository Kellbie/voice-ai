// script.js

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;
const recognition = new SpeechRecognition();
const synthesis = SpeechSynthesis;

const statusParagraph = document.getElementById('status');
const responseParagraph = document.getElementById('response');
const startNotepadButton = document.getElementById('start-notepad');
const stopNotepadButton = document.getElementById('stop-notepad');

const NAME = 'baymax';
let typingEnabled = false;
let conversationHistory = [];
const weatherApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const mapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key

const initializeAssistant = () => {
    speak('Hello, I am Baymax, created solely for the purpose of help. How can I assist you today?');
    statusParagraph.textContent = "Listening for 'Baymax'...";
};

const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synthesis.getVoices().find(voice => voice.name === 'Google UK English Male') || synthesis.getVoices()[0];
    synthesis.speak(utterance);
};

const handleCommand = async (command) => {
    let responseText = "Sorry, I didn't understand that.";

    if (command.toLowerCase().includes(NAME)) {
        if (command.toLowerCase().includes('hello') || command.toLowerCase().includes('hi') || command.toLowerCase().includes('how are you')) {
            responseText = "Hello! I am Baymax. How can I assist you today?";
        } else if (command.toLowerCase().includes('time')) {
            responseText = `The current time is ${new Date().toLocaleTimeString()}.`;
        } else if (command.toLowerCase().includes('date')) {
            responseText = `Today's date is ${new Date().toLocaleDateString()}.`;
        } else if (command.toLowerCase().includes('weather') || command.toLowerCase().includes('temperature')) {
            responseText = await getWeather();
        } else if (command.toLowerCase().includes('distance') || command.toLowerCase().includes('travel time')) {
            responseText = await getDistance();
        } else if (command.toLowerCase().includes('save')) {
            saveConversation(command);
            responseText = "Saving your conversation.";
        } else if (command.toLowerCase().includes('suggestions')) {
            responseText = "I can suggest some topics or help with specific queries.";
        } else {
            responseText = "I can handle specific commands like time, date, weather, or distance.";
        }
    } else {
        responseText = `If you’re trying to call me, my name is Baymax, created solely for the purpose of help.`;
    }

    return responseText;
};

const getWeather = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=your_city&appid=${weatherApiKey}&units=metric`);
    const data = await response.json();
    return `The current temperature in ${data.name} is ${data.main.temp}°C with ${data.weather[0].description}.`;
};

const getDistance = async () => {
    if (!navigator.geolocation) {
        return "Geolocation is not supported by this browser.";
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const destination = prompt('Enter the destination address:');
            const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${lat},${lon}&destinations=${destination}&key=${mapsApiKey}`);
            const data = await response.json();
            const distance = data.rows[0].elements[0].distance.text;
            resolve(`The distance to ${destination} is ${distance}.`);
        });
    });
};

const saveConversation = (command) => {
    conversationHistory.push(command);
};

const typeToNotepad = (text) => {
    if (typingEnabled) {
        // Simulate typing into notepad (you can't directly access a phone's notepad via web technologies)
        console.log("Typing into notepad:", text);
    }
};

const startListening = () => {
    recognition.start();
};

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;

recognition.onstart = () => {
    statusParagraph.textContent = "Listening...";
};

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    statusParagraph.textContent = `You said: ${transcript}`;
    const responseText = await handleCommand(transcript);
    responseParagraph.textContent = responseText;
    speak(responseText);
    typeToNotepad(transcript);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    statusParagraph.textContent = "There was an error. Please try again.";
};

startNotepadButton.addEventListener('click', () => {
    typingEnabled = true;
    startNotepadButton.disabled = true;
    stopNotepadButton.disabled = false;
});

stopNotepadButton.addEventListener('click', () => {
    typingEnabled = false;
    startNotepadButton.disabled = false;
    stopNotepadButton.disabled = true;
});

// Initialize the assistant when the page loads
window.onload = () => {
    initializeAssistant();
    startListening();
};
