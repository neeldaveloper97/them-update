import { getUserId } from '@/services/apiService';
import {
  addDashboardEventListener,
  disconnectDashboardSocket,
  initializeDashboardSocket,
} from '@/services/dashboardSocketService';
import { disconnectSocket, initializeSocket } from '@/services/socketService';
import { updateTrustData } from '@/store/slices/trustSlice';
import {
  createHandleQuickAction,
  createHandleSendMessage,
} from '@/utils/chatHandlers';
import { createStreamingHandlers } from '@/utils/streamingUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const progressSequence = [
  'Thinking',
  'Analyzing',
  'Processing',
  'We are almost done',
];

export default function useChatCore({
  panelType = 'default',
  isMobile: isMobileProp,
  welcomeMessage,
  suppressWelcome = false,
}) {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [flowEvents, setFlowEvents] = useState([]);
  const [metrics, setMetrics] = useState({ valence: [], latency: [] });
  const [latestValence, setLatestValence] = useState(null);
  const [scrollOnNextRender, setScrollOnNextRender] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileProp || false);
  const [progressStatus, setProgressStatus] = useState('');
  const [showDots, setShowDots] = useState(false);

  const progressIndexRef = useRef(0);
  const dotsTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const messageTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const quickActionsRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const messageEndRef = useRef(null);

  const streamingHandlers = useCallback(
    () =>
      createStreamingHandlers({
        setMessages,
        setIsTyping,
        setIsLoading,
        setLatestValence,
        dispatch,
        updateTrustData,
        messageTimeoutRef,
      }),
    [dispatch]
  );

  const handleQuickAction = useCallback(
    () =>
      createHandleQuickAction({
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
        loadingType,
      }),
    [
      isLoading,
      attachments,
      socket,
      socketConnected,
      userId,
      sessionId,
      panelType,
      loadingType,
    ]
  );

  const handleSendMessage = useCallback(
    () =>
      createHandleSendMessage({
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
        loadingType,
      }),
    [
      input,
      attachments,
      isLoading,
      socket,
      socketConnected,
      userId,
      sessionId,
      panelType,
      loadingType,
    ]
  );

  useEffect(() => {
    const removeListener = addDashboardEventListener((event) => {
      setFlowEvents((prev) => [event, ...prev]);
      setMetrics((prev) => ({
        valence: [
          ...prev.valence,
          { time: new Date().toLocaleTimeString(), value: event.valence },
        ],
        latency: [
          ...prev.latency,
          { time: new Date().toLocaleTimeString(), value: event.latency },
        ],
      }));
    });

    initializeDashboardSocket();

    return () => {
      removeListener();
      disconnectDashboardSocket();
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    setIsLoading(true);
    let isMounted = true;
    let currentSocket = null;

    const currentMessageTimeout = messageTimeoutRef.current;

    const initChat = async () => {
      const { storedId, sessionId } = await getUserId('them');
      if (!isMounted) return;
      setUserId(storedId);
      setSessionId(sessionId);

      const handlers = streamingHandlers();

      initializeSocket({
        onConnect: (socketInstance) => {
          currentSocket = socketInstance;
          setSocket(socketInstance);
          setSocketConnected(true);
        },
        onDisconnect: () => setSocketConnected(false),
        onConnectError: () => setSocketConnected(false),
        onAgentResponse: handlers.handleAgentResponse,
        onAgentStream: handlers.handleAgentStream,
        onAgentStreamEnd: handlers.handleAgentStreamEnd,
        onAgentStreamError: handlers.handleAgentStreamError,
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content:
                "Sorry, I couldn't process your request. Please try again later.",
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
          setIsLoading(false);
        },
      });

      const defaultWelcomeMessage =
        "Hello! 👋 I'm here to help you through whatever challenges you're facing. Choose one of the quick options above or simply type your message to get started.";

      // Define messages for each specific path
      const pathMessages = {
        '/them/dashboard':
          'Hi there — if you’ve got a medical bill handy, you can drop it here and I’ll highlight a few things you might want to question.',
        '/them':
          'Hi there — if you’ve got a medical bill handy, you can drop it here and I’ll highlight a few things you might want to question.',
      };

      const selectedMessage =
        pathMessages[path] || welcomeMessage || defaultWelcomeMessage;

      if (!suppressWelcome) {
        setMessages([
          {
            id: '1',
            content: selectedMessage,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
      setIsLoading(false);
      inputRef.current?.focus();
    };

    const handlers = streamingHandlers();
    document.addEventListener(
      'visibilitychange',
      handlers.handleVisibilityChange
    );

    initChat();

    return () => {
      isMounted = false;
      if (currentSocket) disconnectSocket(currentSocket);
      if (currentMessageTimeout) clearTimeout(currentMessageTimeout);
      if (dotsTimeoutRef.current) clearTimeout(dotsTimeoutRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      document.removeEventListener(
        'visibilitychange',
        handlers.handleVisibilityChange
      );
    };
  }, [welcomeMessage, streamingHandlers]);

  useEffect(() => {
    if (isTyping) {
      setShowDots(true);
      setProgressStatus(progressSequence[0]);
      progressIndexRef.current = 0;

      if (dotsTimeoutRef.current) clearTimeout(dotsTimeoutRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);

      dotsTimeoutRef.current = setTimeout(() => setShowDots(false), 10000);

      progressIntervalRef.current = setInterval(() => {
        progressIndexRef.current =
          (progressIndexRef.current + 1) % progressSequence.length;
        setProgressStatus(progressSequence[progressIndexRef.current]);
      }, 20000);
    } else {
      if (dotsTimeoutRef.current) {
        clearTimeout(dotsTimeoutRef.current);
        dotsTimeoutRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      progressIndexRef.current = 0;
      setShowDots(false);
    }

    return () => {
      if (dotsTimeoutRef.current) clearTimeout(dotsTimeoutRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [isTyping]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isMobileProp === undefined) {
      const handleResize = () => setIsMobile(window.innerWidth < 640);
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobileProp]);

  useEffect(() => {
    if (scrollOnNextRender) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setScrollOnNextRender(false);
    }
  }, [messages, scrollOnNextRender]);

  return {
    userId,
    sessionId,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    isTyping,
    setIsTyping,
    socket,
    socketConnected,
    attachments,
    setAttachments,
    fileError,
    setFileError,
    showAttachments,
    setShowAttachments,
    showLoginPrompt,
    setShowLoginPrompt,
    flowEvents,
    setFlowEvents,
    metrics,
    setMetrics,
    latestValence,
    setLatestValence,
    scrollOnNextRender,
    setScrollOnNextRender,
    isMobile,
    setIsMobile,
    showDropZone,
    setShowDropZone,
    progressStatus,
    setProgressStatus,
    showDots,
    setShowDots,
    inputRef,
    fileInputRef,
    quickActionsRef,
    scrollAreaRef,
    messageEndRef,
    handleQuickAction: handleQuickAction(),
    handleSendMessage: handleSendMessage(),
    messageTimeoutRef,
    loadingType,
    setLoadingType,
  };
}
