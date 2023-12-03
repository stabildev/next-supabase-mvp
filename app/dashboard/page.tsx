import { FilesList } from '@/components/FilesList'
import { Uploader } from '@/components/Uploader'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
  const supabase = createClient(cookies())
  const userId = (await supabase.auth.getUser()).data.user?.id

  if (!userId) {
    redirect('/login')
  }

  const { data, error } = await supabase.storage
    .from('Files')
    .list(`${userId}/`)

  // Remove uuid from file name
  const files =
    data?.map((file) => ({
      ...file,
      name: file.name.slice(0, -37),
      fullName: file.name,
    })) || null

  return (
    <main className="flex w-full max-w-4xl flex-1 flex-col items-center gap-10">
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-4xl font-bold">Your files</h2>
        <Uploader />
      </div>
      {error ? (
        <p className="text-red-500">{error.message}</p>
      ) : (
        <FilesList initialFiles={files!} />
      )}
    </main>
  )
}

export default Page
