const socket = io();
const messages = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');

let mySocketId;
socket.on('connect', () => {
    mySocketId = socket.id;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(data.userId === mySocketId ? 'sent' : 'received');

    messageElement.innerHTML = `
        <h4>${data.userId === mySocketId ? 'Tú' : `ID: ${data.userId}`}</h4>

        <p>${data.message}</p>

        <small>${data.timestamp}</small></p>
    `
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});
