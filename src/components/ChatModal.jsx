'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

// Sockets are fully managed inside useChatCore

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Spinner from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog';
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  X,
} from 'lucide-react';

import {
  allQuickActions,
  formatTime,
  getPlaceholderText,
  linkifyBotMessage,
} from '../utils/chatUtils';
import useChatCore from '@/hooks/useChatCore';

function ChatModal({
  panelType = 'default',
  open: controlledOpen,
  onOpenChange,
  ...props
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange : setUncontrolledOpen;
  const [isListening, setIsListening] = useState(false);
  const pathname = usePathname();
  const [recognition, setRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  

  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    isTyping,
    socket,
    socketConnected,
    attachments,
    scrollOnNextRender,
    setScrollOnNextRender,
    isMobile,
    setIsMobile,
    progressStatus,
    showDots,
    inputRef,
    quickActionsRef,
    scrollAreaRef,
    messageEndRef,
    handleQuickAction,
    handleSendMessage,
    messageTimeoutRef,
    loadingType,
  } = useChatCore({ panelType });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }

          setInput(transcript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          if (event.error === 'not-allowed') {
            alert(
              'Microphone access denied. Please allow microphone access to use voice input.'
            );
          } else if (event.error === 'no-speech') {
          } else {
            alert('Speech recognition error: ' + event.error);
          }
        };

        setRecognition(recognitionInstance);
      } else {
        setSpeechSupported(false);
      }
    }
  }, [setInput]);

  // Handle voice input
  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (!recognition) {
      alert('Speech recognition is not initialized.');
      return;
    }

    if (isListening) {
      // Stop listening
      recognition.stop();
    } else {
      // Start listening
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Unable to start voice input. Please try again.');
      }
    }
  };

  useEffect(() => {
    // // const token = sessionStorage.getItem('access_token');
    // if (token !== '' || null) {
    //   //  setShowLoginPrompt(false);
    // }
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const form = document.getElementById('chat-form');
        if (form) form.requestSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkMobile);
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollOnNextRender) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setScrollOnNextRender(false);
    }
  }, [messages, scrollOnNextRender]);

  return (
    <>
      {/* Floating Chat Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed z-50 w-12 h-12 transition-all duration-300 border-none rounded-full shadow-xl cursor-pointer bottom-6 right-6 md:bottom-8 md:right-8 md:h-14 md:w-14 bg-neutral-950 hover:bg-neutral-600 hover:scale-105"
            onClick={() => setOpen(true)}
            aria-label="Open chat assistant"
            data-tour="chatmodal-fab"
          >
            <MessageSquare className="w-5 h-5 text-white md:h-6 md:w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[430px] max-w-full h-[85vh] sm:h-[600px] p-0 shadow-2xl border-0 bg-gradient-to-br from-neutral-50 via-white to-slate-100 right-4 sm:right-8 bottom-4 sm:bottom-8 top-auto flex flex-col rounded-2xl overflow-hidden [&>button]:hidden"
          variant="bottom-right"
          style={{
            position: 'fixed',
            width: isMobile ? 'calc(100vw - 32px)' : '95vw',
          }}
        >
          <div className="hidden">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </div>

          <Card className="flex flex-col h-full gap-0 py-0 bg-black border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between !p-4 text-white bg-black shadow-md">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Brain className="w-6 h-6 text-white sm:h-7 sm:w-7 drop-shadow-lg" />
                  <span className="absolute flex w-3 h-3 -top-1 -right-1">
                    <span
                      className={`absolute inline-flex w-full h-full rounded-full opacity-75 ${
                        socketConnected ? 'bg-green-500' : 'bg-amber-500'
                      } animate-ping`}
                    ></span>
                    <span
                      className={`relative inline-flex w-3 h-3 ${
                        socketConnected ? 'bg-green-500' : 'bg-amber-500'
                      } rounded-full`}
                    ></span>
                  </span>
                </div>
                <CardTitle className="text-base font-bold tracking-tight sm:text-lg">
                  RAI-Real Aligned Intelligence
                </CardTitle>
              </div>

              {/* Single improved close button wrapped in DialogClose */}
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white transition-all duration-200 rounded-full shadow-sm cursor-pointer bg-white/20 hover:bg-white/40 hover:scale-110"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-white to-slate-50">
              <div className="px-2 py-2 overflow-x-auto border-t border-b rounded-none cursor-pointer bg-gradient-to-r from-neutral-100/60 via-white to-slate-100 sm:px-4 scrollbar custom border-slate-200">
                <div
                  className="flex gap-2 pb-1"
                  ref={quickActionsRef}
                  data-tour="chatmodal-quick-actions"
                >
                  {allQuickActions[panelType]?.map((action) => {
                    return (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuickAction(action.text, action.redirectUrl)
                        }
                        disabled={
                          isLoading || (!socketConnected && !action.redirectUrl)
                        }
                        className={`bg-neutral-800 text-white text-xs whitespace-nowrap rounded-full px-3 py-1 
                        transition-all duration-200 shadow-sm hover:shadow flex-shrink-0
                        ${
                          !socketConnected && !action.redirectUrl
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }
                      `}
                      >
                        {action.text}
                        {action.redirectUrl && (
                          <ExternalLink className="inline w-3 h-3 ml-1" />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {isMobile && (
                  <div className="flex justify-center gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 p-0"
                      onClick={() => {
                        if (quickActionsRef.current) {
                          quickActionsRef.current.scrollBy({
                            left: -200,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 p-0"
                      onClick={() => {
                        if (quickActionsRef.current) {
                          quickActionsRef.current.scrollBy({
                            left: 200,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="!h-[calc(100%_-_88px)] lg:h-[400px] overflow-y-auto">
                <ScrollArea className="" ref={scrollAreaRef}>
                  <div
                    className="flex flex-col gap-3 px-3 py-3 sm:py-4 sm:px-4"
                    data-tour="chatmodal-chat-area"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        } group`}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-1.5 sm:mr-2 self-end mb-1 hidden xs:block flex-shrink-0">
                            <AvatarFallback className="text-xs text-white bg-gradient-to-br from-neutral-500 to-indigo-600 sm:text-sm">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 shadow-sm transition-all ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-neutral-800 to-neutral-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          <div className="prose prose-xs max-w-none">
                            {message.sender === 'bot'
                              ? message.isFinal
                                ? linkifyBotMessage(message.content)
                                : message.content
                              : message.content}
                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <div className="mt-2 flex flex-col gap-2">
                                  {message.attachments.map((file) => (
                                    <div
                                      key={
                                        file.id ||
                                        `file-${file.name}-${Date.now()}`
                                      }
                                      className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg"
                                    >
                                      <div className="relative w-8 h-8 bg-slate-200 rounded flex items-center justify-center overflow-hidden">
                                        {file.type?.startsWith('image/') ? (
                                          <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-8 h-8 object-cover rounded"
                                          />
                                        ) : file.type === 'application/pdf' ? (
                                          <iframe
                                            src={file.url}
                                            title={file.name}
                                            className="w-16 h-16 border rounded"
                                          />
                                        ) : (
                                          <Paperclip className="w-4 h-4 text-slate-500" />
                                        )}
                                        {isTyping &&
                                          loadingType === 'image' &&
                                          messages[messages.length - 1]?.id ===
                                            message.id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                              <Spinner className="size-4 border-neutral-800" />
                                            </div>
                                          )}
                                      </div>

                                      <div className="flex flex-col text-xs w-7/12">
                                        <span
                                          className="font-medium truncate text-neutral-900"
                                          title={file.name}
                                        >
                                          {file.name}
                                        </span>
                                        <span className="text-slate-500">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender === 'user'
                                ? 'text-neutral-100'
                                : 'text-slate-400'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                        {message.sender === 'user' && (
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ml-1.5 sm:ml-2 self-end mb-1 hidden xs:block flex-shrink-0">
                            <AvatarFallback className="text-xs text-white bg-gradient-to-br from-slate-600 to-slate-800 sm:text-sm">
                              ME
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-1.5 sm:mr-2 self-end mb-1 hidden xs:block flex-shrink-0">
                          <AvatarFallback className="text-xs text-white bg-gradient-to-br from-neutral-500 to-indigo-600 sm:text-sm">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100">
                          {showDots ? (
                            <div className="flex gap-2">
                              <div className="w-2 h-2 rounded-full bg-neutral-950 animate-bounce" />
                              <div
                                className="w-2 h-2 rounded-full bg-neutral-950 animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              />
                              <div
                                className="w-2 h-2 rounded-full bg-neutral-950 animate-bounce"
                                style={{ animationDelay: '0.4s' }}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-600">
                                {progressStatus}
                              </span>
                              <Spinner className="size-4 border-neutral-800" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {isLoading && !isTyping && (
                      <div className="flex justify-center py-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50/50">
                          <Skeleton className="w-3 h-3 rounded-full bg-neutral-100 animate-pulse" />
                          <Skeleton className="w-16 h-3 bg-neutral-100 animate-pulse" />
                          <Skeleton className="w-3 h-3 rounded-full bg-neutral-100 animate-pulse" />
                        </div>
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
            <CardFooter className="!p-3 bg-white border-t !sm:p-4  flex-col items-start gap-0 relative">
              {/* Voice listening overlay */}
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg z-10">
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-full shadow-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">
                      Listening... Click mic to stop
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-red-400 rounded animate-pulse"></div>
                      <div
                        className="w-1 h-6 bg-red-500 rounded animate-pulse"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-1 h-3 bg-red-400 rounded animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-1 h-5 bg-red-500 rounded animate-pulse"
                        style={{ animationDelay: '0.3s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex items-center gap-5 relative w-full rounded-lg transition-all`}
              >
                <div className="flex items-center w-full bg-white border rounded-full shadow-md border-slate-200">
                  <form
                    id="chat-form"
                    onSubmit={handleSendMessage}
                    className="flex items-center w-full px-2 py-1"
                    data-tour="chatmodal-input-form"
                  >
                    <div className="relative inline-block">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className={`cursor-pointer transition-all duration-200 ${
                                isListening
                                  ? 'bg-red-100 hover:bg-red-200 text-red-600'
                                  : speechSupported
                                    ? 'hover:bg-slate-100'
                                    : 'opacity-50 cursor-not-allowed'
                              }`}
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleVoiceInput}
                              disabled={!speechSupported || !socketConnected}
                            >
                              <Mic
                                className={`w-4 h-4 ${
                                  isListening
                                    ? 'text-red-600 animate-pulse'
                                    : ''
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs cursor-pointer">
                              {!speechSupported
                                ? 'Voice input not supported'
                                : isListening
                                  ? 'Click to stop recording'
                                  : 'Click to start voice input'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex-1 mx-1 flex flex-col">
                      <Input
                        ref={inputRef}
                        placeholder={getPlaceholderText(
                          socketConnected,
                          attachments.length
                        )}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={!socketConnected || isListening}
                        className="w-full px-2 text-sm border-0 rounded-none shadow-none focus-visible:ring-0 h-9 placeholder:text-slate-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        isLoading ||
                        isTyping ||
                        (!input.trim() && attachments.length === 0) ||
                        !socketConnected ||
                        isListening
                      }
                      className={`h-8 cursor-pointer w-8 ml-1 flex-shrink-0 ${
                        (!input.trim() && attachments.length === 0) ||
                        !socketConnected ||
                        isListening
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-neutral-500 hover:bg-neutral-600 text-white'
                      } rounded-full transition-all duration-200`}
                      data-tour="chatmodal-send-button"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </div>

              <div className="flex justify-end w-full mt-1">
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    socketConnected ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      socketConnected ? 'bg-green-500' : 'bg-amber-500'
                    } ${socketConnected ? 'animate-pulse' : ''}`}
                  ></div>
                  <span>{socketConnected ? 'Connected' : 'Connecting...'}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

ChatModal.propTypes = {
  panelType: PropTypes.oneOf(['default', 'medoptimize']),
};

export default ChatModal;
