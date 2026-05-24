import { useEffect, useRef, useCallback } from 'react';

/**
 * useAICoachChat
 *
 * Connects to the private Laravel Reverb WebSocket channel `user.{userId}`
 * and listens for the `AICoachReplyReceived` broadcast event emitted by
 * the ProcessCoachInquiry background job.
 *
 * When a reply arrives it calls `onReply(text)` — the parent component
 * pushes the text into its chat message state.
 *
 * @param {number|null} userId         - Authenticated user ID
 * @param {Function}    onReply        - Callback: (replyText: string) => void
 * @param {Function}    onError        - Callback: (errorText: string) => void
 */
export function useAICoachChat(userId, onReply, onError) {
  const channelRef = useRef(null);

  useEffect(() => {
    if (!userId || !window.Echo) return;

    // Subscribe to the user's private channel
    const channel = window.Echo
      .private(`user.${userId}`)
      .listen('.AICoachReplyReceived', (data) => {
        if (data?.reply) {
          onReply(data.reply);
        } else {
          onError?.('Received an empty reply from the AI coach.');
        }
      });

    channelRef.current = channel;

    return () => {
      // Leave only the AICoachReplyReceived listener — other hooks
      // (useAIInsights) may share the same channel subscription.
      try {
        channel.stopListening('.AICoachReplyReceived');
      } catch {
        // noop — channel may already be cleaned up
      }
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * sendMessage — dispatches the chat to the backend (non-blocking, 202 response).
   * The reply will arrive via the WebSocket listener above.
   */
  const sendMessage = useCallback(async (api, message, history = []) => {
    const response = await api.post('/ai/chat', { message, history });
    // 202 = queued successfully, reply comes over WebSocket
    return response.status === 202;
  }, []);

  return { sendMessage };
}
