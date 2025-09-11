'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { emojiConfig } from '@/config/panelConfig';

export default function EmojiSelector({ onEmojiSelect, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-9 w-9 text-slate-500 hover:text-yellow-500 hover:bg-yellow-50 disabled:opacity-50 transition-all duration-200"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3 rounded-xl shadow-lg border-gray-700/60"
        align="end"
        sideOffset={5}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Select your mood
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-slate-400 hover:text-slate-600 p-0"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {emojiConfig.defaultEmojis.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="h-12 w-12 p-0 rounded-xl hover:bg-slate-100 transition-all duration-150 hover:scale-110 active:scale-95"
                onClick={() => handleEmojiSelect(item)}
                title={item.name}
              >
                <span className="text-2xl">{item.emoji}</span>
              </Button>
            ))}
          </div>

          <div className="pt-1 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              More emoji options coming soon
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
