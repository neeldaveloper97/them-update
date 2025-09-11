'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import EmojiSelector from './EmojiSelector';

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  socketConnected,
}) {
  const inputRef = useRef(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, selectedEmoji);
    setSelectedEmoji(null);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      id="chat-form"
      onSubmit={handleSubmit}
      className="w-full flex gap-1.5 sm:gap-2 items-center"
    >
      {!isMobile && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!socketConnected}
                className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-primary-light-50 disabled:opacity-50 transition-all duration-200"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Attach files (coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div className="flex-1 relative group">
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-purple-100/20 rounded-full opacity-0 ${isFocused ? 'opacity-100' : ''} transition-opacity duration-300 -z-10`}
        ></div>

        {isMobile && socketConnected && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-slate-400 z-10"
            onClick={() => inputRef.current?.focus()}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
        )}

        <Input
          ref={inputRef}
          placeholder={
            socketConnected ? 'Type your message...' : 'Connecting to server...'
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading || !socketConnected}
          className={`w-full border-slate- focus-visible:ring-blue-500 rounded-full shadow-sm py-2 sm:py-5 text-sm sm:text-base pl-${isMobile ? '10' : '4'} pr-4 transition-all duration-200 ${isFocused ? 'border-blue-300 shadow' : ''}`}
        />

        {isFocused && !value && !selectedEmoji && (
          <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span className="text-xs sm:text-sm text-blue-400/70 animate-pulse flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-400/70" />
              <span>What's on your mind?</span>
            </span>
          </div>
        )}

        {selectedEmoji && (
          <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            <span className="text-lg sm:text-xl">{selectedEmoji.emoji}</span>
            <span className="text-xs text-slate-500 border-l border-gray-700/60 pl-1.5">
              {selectedEmoji.name}
            </span>
          </div>
        )}

        {selectedEmoji && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 text-slate-400 hover:text-slate-600 rounded-full"
            onClick={() => setSelectedEmoji(null)}
          >
            <span className="text-xs">×</span>
          </Button>
        )}
      </div>

      <EmojiSelector
        onEmojiSelect={handleEmojiSelect}
        disabled={!socketConnected}
      />

      {!isMobile && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!socketConnected}
                className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-primary-light-50 disabled:opacity-50 transition-all duration-200"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Voice input (coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Button
        type="submit"
        size="icon"
        disabled={
          isLoading || (!value.trim() && !selectedEmoji) || !socketConnected
        }
        className={`h-9 w-9 ${(!value.trim() && !selectedEmoji) || !socketConnected ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md'} rounded-full transition-all duration-200 ${value.trim() || selectedEmoji ? 'hover:scale-105 active:scale-95' : ''}`}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
