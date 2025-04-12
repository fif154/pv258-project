import { useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import styles from "./Chat.module.css"
import { IoMdSend } from "react-icons/io";

type Role = 'assistant' | 'user' | 'bot';
type Message = {
    role: Role;
    content: string;
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi! Ask me anything!' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input } as Message;
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
        console.log('xd', newMessages)
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: newMessages.map(m => m.content),
          });

      setMessages([...newMessages, {role: 'bot', content: res.text ?? ''}])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! Something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={styles.messageBox}>
        {messages.map((msg, i) => (
            <div className={`${styles.messageContainer} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>
              <div key={i} className={styles.message}>{msg.content}</div>
            </div>
        ))}
        {loading && "Typing..."}
      </div>
      <div className={styles.chatWindow}>
        <input
        className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button className={styles.send} onClick={sendMessage}><IoMdSend /></button>
      </div>
    </div>
  )
}

export default Chat
