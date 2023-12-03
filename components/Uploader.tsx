'use client'

import { uploadFileAction } from '@/utils/actions'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

export const Uploader = () => {
  const [open, setOpen] = useState(false)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data, error } = await uploadFileAction(formData)

    if (error) {
      alert(error.message)
      return
    }

    if (data) {
      setOpen(false)
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants()}>Upload a file</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Upload a file</DialogTitle>
          <DialogDescription>
            Upload a file to your account. We will keep it safe.
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-full overflow-hidden py-2">
          <div className="flex h-56 w-full max-w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted p-4 text-muted-foreground dark:bg-muted/20">
            <input
              type="file"
              onChange={(e) => {
                if (!e.target.files) return
                uploadFile(e.target.files[0])
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
