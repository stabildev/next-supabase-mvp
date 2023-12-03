import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

const Page = async () => {
  const cookie = cookies()
  const { auth } = createClient(cookie)
  const user = await auth.getUser().then((res) => res.data?.user)

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8">
      <h2 className="text-4xl font-bold">Landing Page</h2>
      <p>
        {user ? `You are logged in as ${user.email}` : 'You are not logged in'}
      </p>
    </main>
  )
}

export default Page
