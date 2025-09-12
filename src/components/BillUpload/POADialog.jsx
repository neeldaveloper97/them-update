'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import POAForm from './POAForm';

export default function POADialog({ open, onOpenChange, onConfirm, userData }) {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setHasError(false);

    try {
      const res = await onConfirm?.(payload);
      onOpenChange(false);
      return res;
    } catch (error) {
      console.error('Submission failed in handleSubmit:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <POAForm
          userData={userData}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
