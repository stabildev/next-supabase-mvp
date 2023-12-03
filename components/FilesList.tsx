'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { format } from 'date-fns'

type FileObject = NonNullable<
  Awaited<
    ReturnType<ReturnType<SupabaseClient['storage']['from']>['list']>
  >['data']
>[number] & {
  fullName: string
}

interface FilesListProps {
  initialFiles: FileObject[]
}

export const FilesList = ({ initialFiles }: FilesListProps) => {
  const [files, setFiles] = useState<FileObject[]>(initialFiles)

  const supabase = createClient()

  const deleteFile = async (file: FileObject) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    const userId = (await supabase.auth.getUser()).data.user?.id

    console.log('userId', userId)
    console.log('file', file.fullName)

    const { data, error } = await supabase.storage
      .from('Files')
      .remove([`${userId}/${file.fullName}`])

    console.info('data', data)

    if (error) {
      alert(error.message)
      return
    } else {
      setFiles(files.filter((f) => f.id !== file.id))
    }
  }

  return files.length ? (
    <div className="grid w-full gap-5 sm:grid-cols-3">
      {files.map((file) => (
        <FileCard key={file.id} file={file} deleteFile={deleteFile} />
      ))}
    </div>
  ) : (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-muted-foreground">
      <p>You have no files yet</p>
      <p>Upload your first file now</p>
    </div>
  )
}

interface FileCardProps {
  file: FileObject
  deleteFile: (file: FileObject) => void
}

const FileCard = ({ file, deleteFile }: FileCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow sm:pt-3">
        Uploaded at {format(new Date(file.created_at), 'dd/MM/yyyy')}
      </CardContent>
      <CardFooter className="flex w-full flex-row justify-end border-t pb-3 pt-3">
        <Button
          variant="ghost"
          className="hover:text-red-500"
          onClick={() => deleteFile(file)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
