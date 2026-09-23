import { useState, useCallback } from 'react';
import { queryProject } from '../services/api.js';

export function useChat(projectId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || !projectId) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await queryProject(projectId, question);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        citations: response.citations || [],
        confidence: response.confidence,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.response?.data?.error || err.message}`,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const clearMessages = () => setMessages([]);

  return { messages, loading, sendMessage, clearMessages };
}
