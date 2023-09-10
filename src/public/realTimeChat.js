const socket = io();
const messageContainer = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userEmail = document.getElementById('user-email').value;
    const messageInput = document.getElementById('message-input');
    
    const data = {
        user: userEmail,
        message: messageInput.value
    };

    socket.emit('chatMessage', {
        email: data.user,
        message: data.message
    });
    messageInput.value = '';
});
socket.on('chatMessage', (data) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<b>${data.user}:</b> ${data.message}`;
    messageContainer.appendChild(messageElement);
});

async function loadPreviousMessages() {
    try {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messages.forEach(data => {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<b>${data.user}:</b> ${data.message}`;
            messageContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error loading previous messages:', error);
    }
}
loadPreviousMessages();