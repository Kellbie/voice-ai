// Check for browser support
const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

if (!hasSpeechRecognition) {
    document.getElementById('response').innerText = "Sorry, your browser does not support Speech Recognition.";
} else {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const startButton = document.getElementById('start-btn');
    const status = document.getElementById('status');
    const response = document.getElementById('response');

    startButton.addEventListener('click', () => {
        recognition.start();
        status.innerText = "Listening...";
    });

    recognition.onresult = event => {
        const speech = event.results[0][0].transcript.toLowerCase();
        status.innerText = "Processing...";
        
        if (speech.includes("hello") || speech.includes("hi")) {
            response.innerText = "Hello! How can I help you today?";
        }else if (transcript.toLowerCase().includes("hello")) {
            responseText = "Hello there! My name is baymax, How can I assist you today?";
        } else if (transcript.toLowerCase().includes("what's your name")) {
            responseText = "My name is baymax and I am your friendly voice assistant!";
        } else if (transcript.toLowerCase().includes("what can you do")) {
            responseText = "Well, I can do alot so tell me what you would like me to do and id do my best";
        } else if (speech.includes("search")) {
            const query = speech.replace("search", "").trim();
            if (query) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
                response.innerText = `Searching for: ${query}`;
            } else {
                response.innerText = "Please specify what to search for.";
            }
        } else {
            response.innerText = "Sorry, I didn't understand that.";
        }
        
        recognition.stop();
        status.innerText = "Press the button and speak...";
    };

    recognition.onerror = event => {
        status.innerText = "Error occurred: " + event.error;
    };
}
