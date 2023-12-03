'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const uploadFileAction = async (formData: FormData) => {
  const supabase = createClient(cookies())
  const user = (await supabase.auth.getUser()).data.user

  if (!user) {
    return { error: { message: 'User not found' } }
  }

  const file = formData.get('file') as File
  // Add a random uuid to the file name to make it unique
  const uuid = crypto.randomUUID()
  // Add user id to the path to structure the files in folders
  const path = `${user.id}/${file.name}.${uuid}`

  const { data, error } = await supabase.storage
    .from('Files')
    .upload(path, file)

  return { data, error }
}
