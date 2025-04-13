function togggleMobileMenu(){
    document.getElementById("menu").classList.toggle("active");
}
// DOM Elements
const chatBox = document.querySelector('.chat-box .scroll-area');
const chatInput = document.querySelector('#chatInput');
const sendButton = document.querySelector('#sendButton');
const chatMessageContainer = document.querySelector('.chat-box ul');
const chatbotAvatar = 'https://www.example.com/chatbot-avatar.png'; // Replace with the actual avatar URL

// Function to check if the chat is scrolled to the bottom
function isScrolledToBottom() {
  return chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
}

// Function to create a message (user or bot)
function createMessage(messageText, sender) {
  const messageElement = document.createElement('li');
  const avatar = document.createElement('span');
  const messageContainer = document.createElement('div');

  // Set the avatar and message content
  avatar.style.backgroundImage = `url(${sender === 'bot' ? chatbotAvatar : 'https://www.example.com/user-avatar.png'})`;
  messageContainer.textContent = messageText;

  // Style based on the sender (user or bot)
  if (sender === 'bot') {
    messageElement.style.textAlign = 'left';
    messageElement.style.justifyContent = 'flex-start';
    messageElement.style.flexDirection = 'row';
  } else {
    messageElement.style.textAlign = 'right';
    messageElement.style.justifyContent = 'flex-end';
    messageElement.style.flexDirection = 'row-reverse';
    avatar.style.backgroundColor = 'var(--yellow)';
  }

  messageElement.appendChild(avatar);
  messageElement.appendChild(messageContainer);
  chatMessageContainer.appendChild(messageElement);

  // Scroll to the bottom if needed
  if (isScrolledToBottom()) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Function to simulate bot response with typing animation
function simulateBotResponse(userMessage) {
  const botMessageContainer = document.createElement('li');
  botMessageContainer.style.textAlign = 'left';
  botMessageContainer.style.justifyContent = 'flex-start';
  botMessageContainer.style.flexDirection = 'row';

  const avatar = document.createElement('span');
  avatar.style.backgroundImage = `url(${chatbotAvatar})`;

  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('typing-indicator');
  typingIndicator.textContent = 'Bot is typing...';

  botMessageContainer.appendChild(avatar);
  botMessageContainer.appendChild(typingIndicator);
  chatMessageContainer.appendChild(botMessageContainer);

  // Simulate typing delay and then replace with the actual response
  setTimeout(() => {
    typingIndicator.textContent = ''; // Clear typing indicator
    const botMessage = `You said: ${userMessage}`; // Bot reply (this can be dynamic)
    createMessage(botMessage, 'bot');
  }, 2000); // Typing for 2 seconds before replying
}

// Function to handle message sending
function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    createMessage(message, 'user');  // Add user message
    chatInput.value = '';  // Clear input field

    simulateBotResponse(message);  // Simulate bot reply
  }
}

// Listen for send button click
sendButton.addEventListener('click', sendMessage);

// Listen for Enter key press
chatInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Auto resize the input area as the user types
chatInput.addEventListener('input', function() {
  this.style.height = 'auto';  // Reset the height to auto
  this.style.height = (this.scrollHeight) + 'px';  // Set the height to match content
});

// Function to load chat history from localStorage
function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  chatHistory.forEach(message => createMessage(message.text, message.sender));
}

// Function to save chat history to localStorage
function saveChatHistory() {
  const messages = [];
  chatMessageContainer.querySelectorAll('li').forEach(li => {
    const messageText = li.querySelector('div').textContent;
    const sender = li.querySelector('span').style.backgroundColor === 'rgb(255, 255, 0)' ? 'bot' : 'user';
    messages.push({ text: messageText, sender });
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

// Load chat history when the page loads
document.addEventListener('DOMContentLoaded', loadChatHistory);

// Save chat history before the page is unloaded
window.addEventListener('beforeunload', saveChatHistory);
