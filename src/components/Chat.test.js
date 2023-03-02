import { fireEvent, render, screen } from '@testing-library/vue'
import Chat from './Chat.vue'

describe('Websockets chat', () => {
    render(Chat)
    const input = screen.getByPlaceholderText("Введите сообщение")
    const form = screen.getByTestId('chat-form')

    it('Sending message', async () => {
        await fireEvent.update(input, 'Message')
        await fireEvent.submit(form)
        
        const messages = (await screen.findAllByTestId('chat-message', {}, {timeout: 1000}))
        const message = messages?.[messages.length - 1]

        expect(message.innerHTML.trim()).toBe('Message')
    })

    it('Sending empty message', async () => {
        render(Chat)
        await fireEvent.submit(form)

        screen.debug()

        const messages = screen.getByTestId('chat__messages', {}, {timeout: 1000})

        expect(messages.innerHTML.trim()).toBe('')
    })
})