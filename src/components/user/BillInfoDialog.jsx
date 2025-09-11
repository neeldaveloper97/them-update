import React from 'react'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

const BillInfoDialog = () => {
    return (
        <>
            <Button
                size="icon"
                className="h-8 w-8 bg-transparent text-black shadow-none hover:text-white"
                onClick={() => openDetailModal(item)}
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default BillInfoDialog