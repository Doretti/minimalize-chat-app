<template>
    <div class="chat">
        <div data-testid="chat__messages" class="chat__messages">
            <div data-testid="chat-message" :key="message.id" v-for="message in messages" :class="{
                'chat__message-item': true,
                'chat__message-item--author': message.authorId === id
            }">
                {{ message.text }}
            </div>
        </div>
        <form data-testid="chat-form" @submit.prevent="sendMessage" class="chat__inputs">
            <input placeholder="Введите сообщение" v-model="message" type="text">
            <button>Send</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            messages: [],
            message: '',
            connection: null,
            // For example
            id: Math.floor(Math.random() * 1000)
        }
    },
    mounted() {
        this.connection = new WebSocket('ws://websockets.chilkat.io/wsChilkatEcho.ashx')
        this.connection.onopen = (event) => {
            console.log('Websocket has been connected');
        }

        this.connection.onmessage = ({ data }) => {
            try {
                const parsedData = JSON.parse(data)
                if (parsedData.authorId === this.id) {
                    return
                }
                this.messages.push({
                    id: this.messages.length + 1,
                    text: parsedData.text,
                    authorId: parsedData.authorId
                })
            } catch (error) {
                console.log('Message isn\'t correct');
            }
        }
    },
    methods: {
        sendMessage() {
            if (!this.message) {
                return
            }
            if (this.connection.readyState === WebSocket.OPEN) {
                this.connection.send(JSON.stringify({
                    text: this.message.trim(),
                    authorId: this.id
                }))
                this.messages.push({
                    id: this.messages.length + 1,
                    text: this.message.trim(),
                    authorId: this.id 
                })
                this.message = ''
            } else {
                setTimeout(this.sendMessage, 1000)
            }
        }
    }
}
</script>

<style>
:root {
    --black: rgba(0, 0, 0, 0.2);
}

.chat {
    max-width: 50vw;
    max-height: 80vh;
    height: 100%;
    width: 100%;
    border: 1px solid var(--black);
    box-shadow: 0 0 8px var(--black);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.chat__inputs {
    border-top: 1px solid var(--black);
    padding: 8px 12px;
    display: flex;
    align-items: center;
    column-gap: 4px;
    justify-content: space-between;
}

.chat__inputs input,
.chat__inputs button {
    border: 1px solid var(--black);
    border-radius: 4px;
    padding: 4px;
}

.chat__inputs input {
    width: 90%;
}

.chat__inputs button {
    width: 9%;
    cursor: pointer;
}
.chat__messages {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    padding: 6px;
    max-height: 90%;
    overflow-y: auto;
}

.chat__message-item {
    margin-right: auto;
    display: inline-block;
    border: 1px solid var(--black);
    padding: 2px 4px;
    border-radius: 4px;
    max-width: 100%;
    word-break: break-word;
}

.chat__message-item--author {
    margin-right: 0;
    margin-left: auto;
    border-color: rgba(0, 4, 238, 0.4);
}

@media (max-width: 1024px) {
    .chat {
        max-width: 80vw;
    }
}

@media (max-width: 650px) {
    .chat {
        max-width: 95vw;
    }
}
</style>