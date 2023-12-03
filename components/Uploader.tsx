'use client'

import { Button, buttonVariants } from '@/components/ui/button'
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
import Dropzone, { useDropzone } from 'react-dropzone'
import { cn } from '@/utils/utils'
import { Progress } from '@/components/ui/progress'
import { v4 as uuid } from 'uuid'
import { createClient } from '@/utils/supabase/client'

export const Uploader = () => {
  const [open, setOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { open: openDropzone } = useDropzone()

  const uploadFile = async (file: File) => {
    // Set UI state
    setIsHovering(false)
    setIsUploading(true)
    const progressInterval = startSimulatedProgress()

    // Upload file
    const supabase = createClient()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
      alert('You must be logged in to upload a file')
      return
    }

    const path = `${user.id}/${file.name}.${uuid()}`
    console.log(path)

    const { data, error } = await supabase.storage
      .from('Files')
      .upload(path, file)

    // File uploaded
    clearInterval(progressInterval)

    if (error) {
      setUploadProgress(0)
      setIsUploading(false)
      alert(error.message)
      return
    }

    if (data) {
      setUploadProgress(100)
      setOpen(false)
      window.location.reload()
    }
  }

  const startSimulatedProgress = () => {
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 500)

    return interval
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants()}>Upload a file</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="py-1 text-2xl">Upload a file</DialogTitle>
          <DialogDescription>
            Upload a file to your account. We will keep it safe.
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-full overflow-hidden" onClick={openDropzone}>
          <Dropzone
            multiple={false}
            noClick={true}
            onDragEnter={() => setIsHovering(true)}
            onDragLeave={() => setIsHovering(false)}
            onDrop={(files) => uploadFile(files[0])}
          >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'my-2 flex h-56 w-full max-w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-muted-foreground',
                  isHovering
                    ? 'bg-muted dark:bg-muted/40'
                    : 'bg-muted/50 hover:bg-muted/80 dark:bg-muted/10 hover:dark:bg-muted/20'
                )}
              >
                <Button
                  className="mb-2 text-muted-foreground"
                  variant="link"
                  onClick={openDropzone}
                >
                  Click to upload or drag and drop
                </Button>

                {acceptedFiles.length > 0 && (
                  <div className="my-1.5 flex w-24 flex-row justify-center rounded-md border px-3 py-1.5">
                    {acceptedFiles[0].name}
                  </div>
                )}

                {isUploading && (
                  <>
                    <Progress value={uploadProgress} className="h-1 w-full" />
                    {uploadProgress === 100 && (
                      <span className="text-sm text-muted-foreground">
                        Processing...
                      </span>
                    )}
                  </>
                )}
                <input
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                  {...getInputProps()}
                />
              </div>
            )}
          </Dropzone>
        </div>

        <DialogFooter>
          <DialogClose
            className={buttonVariants({ variant: 'ghost' })}
            disabled={isUploading}
          >
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
