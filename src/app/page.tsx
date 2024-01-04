import { cookies } from 'next/headers'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

const Page = async () => {
  const cookie = cookies()
  const { auth } = createClient(cookie)
  const user = await auth.getUser().then((res) => res.data?.user)

  return (
    <main className="flex max-w-6xl flex-1 flex-col items-center justify-center gap-8">
      <h2 className="text-4xl font-bold">Landing Page</h2>
      <p>
        {user ? `You are logged in as ${user.email}` : 'You are not logged in'}
      </p>
      {user && (
        <Link className={buttonVariants({ variant: 'link' })} href="/dashboard">
          Go to dashboard
        </Link>
      )}
    </main>
  )
}

export default Page
