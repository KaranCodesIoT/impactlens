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
      const rawError = err.response?.data?.error || err.message;
      let friendlyError = 'The AI visual analysis model is temporarily busy. Please try asking again in a moment.';

      if (typeof rawError === 'string') {
        try {
          const parsed = JSON.parse(rawError);
          const errorObj = parsed.error || parsed;
          if (errorObj.code === 503 || errorObj.code === 429 || errorObj.message?.includes('demand')) {
            friendlyError = 'The AI visual intelligence model is currently handling high demand. Please try again shortly.';
          } else if (errorObj.message) {
            friendlyError = errorObj.message;
          }
        } catch {
          if (rawError.includes('demand') || rawError.includes('503') || rawError.includes('429')) {
            friendlyError = 'The AI visual intelligence model is currently handling high demand. Please try again shortly.';
          } else {
            friendlyError = rawError;
          }
        }
      }

      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: friendlyError,
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
