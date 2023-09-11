const socket = io();
const messageContainer = document.getElementById('messages');
chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userEmail = document.getElementById('user-email').value;
    const messageInput = document.getElementById('message-input');
    
    const data = {
        email: userEmail,
        message: messageInput.value
    };
   

    socket.emit('chatMessage', {
        email: data.email,
        message: data.message
    });    
    messageInput.value = '';
});

socket.on('chatMessage', data => {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${data.email}: ${data.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; 
});

async function loadPreviousMessages() {
    try {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messages.forEach(data => {
            const messageElement = document.createElement('p');
            messageElement.textContent = `${data.email}: ${data.message}`;
            chatBox.appendChild(messageElement);
        });
        chatBox.scrollTop = chatBox.scrollHeight;  // para asegurarse de que los mensajes más recientes se muestren al final
    } catch (error) {
        console.error('Error loading previous messages:', error);
    }
}

loadPreviousMessages();
