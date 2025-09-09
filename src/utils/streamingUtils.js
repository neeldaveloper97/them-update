export const createStreamingHandlers = ({
  setMessages,
  setIsTyping,
  setIsLoading,
  setLatestValence,
  dispatch,
  updateTrustData,
  messageTimeoutRef,
}) => {
  const currentStreamMessageId = { current: null };
  const isFirstChunk = { current: true };
  const streamBuffer = { current: [] };
  const streamInterval = { current: null };

  const clearPendingTimeout = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  };

  const startCharacterStreaming = (messageId) => {
    if (streamInterval.current) {
      clearTimeout(streamInterval.current);
      streamInterval.current = null;
    }

    const stream = () => {
      if (streamBuffer.current.length === 0) {
        streamInterval.current = null;
        setIsTyping(false);
        setIsLoading(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isFinal: true } : msg
          )
        );
        return;
      }

      const batchSize = document.visibilityState === 'visible' ? 1 : 15;
      const nextChars = streamBuffer.current.splice(0, batchSize);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: msg.content + nextChars.join('') }
            : msg
        )
      );

      const delay = document.visibilityState === 'visible' ? 20 : 200;
      streamInterval.current = setTimeout(stream, delay);
    };

    stream();
  };

  const handleAgentResponse = (data) => {
    clearPendingTimeout();

    const messageId = Date.now().toString();
    const fullMessage = data.message;

    const botMessage = {
      id: messageId,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      agent: data.agent,
      mentalModel: data.mentalModel || '',
      tone: data.tone,
      valence: data.valence,
      growth_signal: data.growth_signal,
      reflection_summary: data.reflection_summary,
      isFinal: false,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);

    let valenceValue = parseFloat(data.valence);
    if (isNaN(valenceValue)) valenceValue = 0.5;
    valenceValue = Math.max(0, Math.min(1, valenceValue));
    setLatestValence(valenceValue);

    const emotionalStage =
      data.emotionalStage ||
      (valenceValue > 0.7
        ? 'positive'
        : valenceValue < 0.3
          ? 'negative'
          : 'neutral');

    dispatch(
      updateTrustData({
        valence: valenceValue,
        confidence: parseFloat(data.confidence) || 0.5,
        emotionalStage,
        reflection_summary: data.reflection_summary,
      })
    );

    let i = 0;
    const interval = setInterval(() => {
      if (i < fullMessage.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: fullMessage.substring(0, i + 1) }
              : msg
          )
        );
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setIsLoading(false);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: fullMessage, isFinal: true }
              : msg
          )
        );
      }
    }, 10);
  };

  const handleAgentStream = (rawDelta) => {
    let parsed;
    try {
      parsed = typeof rawDelta === 'string' ? JSON.parse(rawDelta) : rawDelta;
    } catch (err) {
      console.error('❌ Streaming parse error:', rawDelta);
      return;
    }

    if (!parsed?.delta) return;

    const chars = parsed.delta.split('');

    if (isFirstChunk.current) {
      clearPendingTimeout();

      isFirstChunk.current = false;
      const messageId = Date.now().toString();
      currentStreamMessageId.current = messageId;

      const newBotMessage = {
        id: messageId,
        content: '',
        sender: 'bot',
        timestamp: new Date(),
        agent: parsed.agent,
        mentalModel: parsed.mental_model || '',
        tone: parsed.tone,
        valence: parsed.valence,
        growth_signal: parsed.growth_signal,
        reflection_summary: parsed.reflection_summary,
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);

      let valenceValue = parseFloat(parsed.valence);
      if (isNaN(valenceValue)) valenceValue = 0.5;
      else valenceValue = Math.max(0, Math.min(1, valenceValue));

      const emotionalStage =
        parsed.emotionalStage ||
        (valenceValue > 0.7
          ? 'positive'
          : valenceValue < 0.3
            ? 'negative'
            : 'neutral');

      dispatch(
        updateTrustData({
          valence: valenceValue,
          confidence: parseFloat(parsed.confidence) || 0.5,
          emotionalStage,
          reflection_summary: parsed.reflection_summary,
        })
      );

      setLatestValence(valenceValue);

      streamBuffer.current = chars;
      setIsLoading(true);
      startCharacterStreaming(messageId);
    } else {
      streamBuffer.current.push(...chars);
    }
  };

  const handleAgentStreamEnd = () => {
    if (
      streamBuffer.current.length > 0 &&
      !streamInterval.current &&
      currentStreamMessageId.current
    ) {
      startCharacterStreaming(currentStreamMessageId.current);
    } else if (streamBuffer.current.length === 0 && !streamInterval.current) {
      setIsTyping(false);
      setIsLoading(false);
    }

    isFirstChunk.current = true;
    currentStreamMessageId.current = null;
  };

  const handleAgentStreamError = (error) => {
    console.error('Stream error:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: '⚠️ Stream failed. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
    setIsLoading(false);
    isFirstChunk.current = true;
    currentStreamMessageId.current = null;
  };

  const handleVisibilityChange = () => {
    if (
      document.visibilityState === 'visible' &&
      currentStreamMessageId.current &&
      streamBuffer.current.length > 0 &&
      !streamInterval.current
    ) {
      startCharacterStreaming(currentStreamMessageId.current);
    }
  };

  return {
    handleAgentResponse,
    handleAgentStream,
    handleAgentStreamEnd,
    handleAgentStreamError,
    handleVisibilityChange,
    startCharacterStreaming,
    currentStreamMessageId,
    isFirstChunk,
    streamBuffer,
    streamInterval,
  };
};
