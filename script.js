// script.js

// Check if the browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

if (!SpeechRecognition) {
    alert("Sorry, your browser does not support the Web Speech API.");
}

const recognition = new SpeechRecognition();
const synthesis = SpeechSynthesis;
const startButton = document.getElementById('start-btn');
const statusParagraph = document.getElementById('status');
const responseParagraph = document.getElementById('response');

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startButton.addEventListener('click', () => {
    if (synthesis.speaking) {
        alert("Give me a minute im still talking.");
        return;
    }

    startButton.disabled = true;
    statusParagraph.textContent = "Listening...";
    
    recognition.start();
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    statusParagraph.textContent = `You said: ${transcript}`;

    let responseText = "Sorry, I didn't get that.";
    
    if (transcript.toLowerCase().includes("hello")) {
        responseText = "Hello there! My name is baymax, How can I assist you today?";
    } else if (transcript.toLowerCase().includes("what's your name")) {
        responseText = "My name is baymax and I am your friendly voice assistant!";
    } else if (transcript.toLowerCase().includes("what can you do")) {
        responseText = "Well, I can do alot so tell me what you would like me to do and id do my best";
    }

    responseParagraph.textContent = responseText;

    const utterance = new SpeechSynthesisUtterance(responseText);
    synthesis.speak(utterance);
    
    utterance.onend = () => {
        startButton.disabled = false;
        statusParagraph.textContent = "Click the button to start...";
    };
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    statusParagraph.textContent = "There was an error. Please try again.";
    startButton.disabled = false;
};
