import { sendMessage } from '@/services/socketService';
import { convertFilesToBase64, prepareMessageAttachments } from './chatUtils';

export const createHandleQuickAction = ({
  isLoading,
  setMessages,
  setIsLoading,
  setIsTyping,
  setScrollOnNextRender,
  attachments,
  socket,
  socketConnected,
  userId,
  sessionId,
  panelType,
  messageTimeoutRef,
  setLoadingType,
}) => {
  return async (actionText, redirectUrl) => {
    if (isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: actionText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setScrollOnNextRender(true);
    setLoadingType(attachments.length > 0 ? 'image' : 'text');

    if (redirectUrl) {
      const redirectMessage = {
        id: (Date.now() + 1).toString(),
        content: `I'm redirecting you to our specialized portal for medical billing assistance. One moment please...`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, redirectMessage]);
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      return;
    }

    const base64Files = await convertFilesToBase64(attachments);

    try {
      if (socket && socketConnected) {
        const filePayload = base64Files.length > 0 ? base64Files[0] : null;
        const success = sendMessage(
          socket,
          userId,
          sessionId,
          actionText,
          panelType,
          filePayload
        );
        if (!success) throw new Error('Failed to send message');
      } else {
        throw new Error('Socket connection not established');
      }

      messageTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content:
              "I'm sorry, but it's taking longer than expected to process your request. Please try again later.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }, 60000);
    } catch (error) {
      console.error('Error sending quick action:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content:
            "Sorry, I couldn't connect to the server. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setIsLoading(false);
      setLoadingType('button');
    }
  };
};

export const createHandleSendMessage = ({
  input,
  setInput,
  attachments,
  setAttachments,
  setShowAttachments,
  isLoading,
  setIsLoading,
  setIsTyping,
  setMessages,
  setScrollOnNextRender,
  setFileError,
  socket,
  socketConnected,
  userId,
  sessionId,
  panelType,
  inputRef,
  messageTimeoutRef,
  setLoadingType,
}) => {
  return async (e) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    let messageContent = input.trim();
    let messageAttachments = [];
    let filePayload = null;

    if (attachments.length > 0) {
      try {
        const result = await prepareMessageAttachments(attachments);
        messageAttachments = result.messageAttachments;
        filePayload = result.filePayload;
      } catch (error) {
        setFileError('Failed to process file. Please try again.');
        return;
      }
    }

    const userMessage = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      attachments: messageAttachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setScrollOnNextRender(true);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setAttachments([]);
    setShowAttachments(false);
    setLoadingType(attachments.length > 0 ? 'image' : 'text');

    try {
      if (socket && socketConnected) {
        const success = sendMessage(
          socket,
          userId,
          sessionId,
          messageContent,
          panelType,
          filePayload
        );
        if (!success) throw new Error('Failed to send message');

        messageTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content:
                "I'm sorry, but it's taking longer than expected to process your message. Please try again later.",
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
        }, 100000);
      } else {
        throw new Error('Socket connection not established');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content:
            "Sorry, I couldn't connect to the server. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setIsLoading(false);
    } finally {
      inputRef.current?.focus();
    }
  };
};
