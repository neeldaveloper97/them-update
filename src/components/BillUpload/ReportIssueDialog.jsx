import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ReportIssueDialog({ open, onCancel, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Issue</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          We'll investigate this parsing issue and improve our system. Thank you
          for your feedback.
        </p>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
