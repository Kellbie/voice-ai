// script.js

// Check if the browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

if (!SpeechRecognition || !SpeechSynthesis) {
    alert("Sorry, your browser does not support the Web Speech API.");
}

const recognition = new SpeechRecognition();
const synthesis = SpeechSynthesis;
const statusParagraph = document.getElementById('status');
const responseParagraph = document.getElementById('response');

const NAME = 'jarvis';

// Configure recognition
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const getWeather = async () => {
    const apiKey = '9aa30cf656c812535386bd4be91bd84b'; // Replace with your OpenWeatherMap API key
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=your_city&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return `The current temperature in ${data.name} is ${data.main.temp}°C with ${data.weather[0].description}.`;
};

const handleCommand = async (command) => {
    let responseText = "Sorry, I didn't understand that.";
    
    if (command.toLowerCase().includes(NAME)) {
        if (command.toLowerCase().includes('time')) {
            responseText = `The current time is ${new Date().toLocaleTimeString()}.`;
        } else if (command.toLowerCase().includes('date')) {
            responseText = `Today's date is ${new Date().toLocaleDateString()}.`;
        } else if (command.toLowerCase().includes('temperature')) {
            responseText = await getWeather();
        } else if (command.toLowerCase().includes('calculate')) {
            try {
                const expression = command.toLowerCase().replace('calculate', '').trim();
                responseText = `The result is ${eval(expression)}.`;
            } catch (e) {
                responseText = "Sorry, there was an error with the calculation.";
            }
        } else {
            // Use a simple internet search for questions
            responseText = "I can only handle specific commands like time, date, temperature, or calculations.";
        }
    } else {
        responseText = `You need to say '${NAME}' before your command.`;
    }

    return responseText;
};

const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synthesis.getVoices().find(voice => voice.name === 'Google UK English Male') || synthesis.getVoices()[0];
    synthesis.speak(utterance);
};

const startListening = () => {
    recognition.start();
};

recognition.onstart = () => {
    statusParagraph.textContent = "Listening...";
};

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    statusParagraph.textContent = `You said: ${transcript}`;
    const responseText = await handleCommand(transcript);
    responseParagraph.textContent = responseText;
    speak(responseText);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    statusParagraph.textContent = "There was an error. Please try again.";
};

// Start listening as soon as the page loads
window.onload = () => {
    startListening();
};
