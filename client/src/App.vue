<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label for="name">What's your name?</label>
        <input type="text" id="name" v-model="name" />
        <button type="submit">Submit</button>
      </form>
    </div>
    <div class="chat-container" v-else>
      <div class="messages-container">
        <div v-for="message in messages" :key="message">
          [{{ message.name }}]: {{ message.text }}
        </div>
      </div>
      <div v-if="typingDisplay">{{ typingDisplay }}</div>
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label for="message">Message:</label>
          <input
            type="text"
            id="message"
            v-model="messageText"
            @input="emitTyping"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';

const socket = io('http://localhost:3000');
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');

onBeforeMount(() => {
  socket.emit('findAllMessages', {}, (response) => {
    messages.value = response;
  });

  socket.on('message', (message) => {
    messages.value.push(message);
  });

  socket.on('typing', ({ name, isTyping }) => {
    isTyping
      ? (typingDisplay.value = `${name} is typing...`)
      : (typingDisplay.value = '');
  });
});

const join = () => {
  socket.emit('join', { name: name.value }, () => {
    joined.value = true;
  });
};

const sendMessage = () => {
  socket.emit('createMessage', { text: messageText.value }, () => {
    messageText.value = '';
  });
};

const emitTyping = () => {
  socket.emit('typing', { isTyping: true });
  timeout = setTimeout(() => {
    socket.emit('typing', { isTyping: false });
  }, 2000);
};
</script>

<style scoped>
.chat {
  padding: 20px;
  height: 100vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
}
</style>