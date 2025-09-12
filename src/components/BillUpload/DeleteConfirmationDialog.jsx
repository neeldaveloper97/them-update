import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeleteConfirmationDialog({
  open,
  onCancel,
  onDelete,
  deletingKey,
  item,
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete "{item?.id || ''}"? This action cannot
          be undone.
        </p>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={deletingKey !== null}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={deletingKey === item?.s3_key}
          >
            {deletingKey === item?.s3_key ? 'Deleting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
