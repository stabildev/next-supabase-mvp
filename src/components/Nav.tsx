import { cookies } from 'next/headers'
import Link from 'next/link'

import AuthButton from '@/components/AuthButton'
import { createClient } from '@/utils/supabase/server'

export const Nav = async () => {
  const user = (await createClient(cookies()).auth.getUser()).data?.user

  return (
    <nav className="fixed top-0 z-10 flex h-16 w-full justify-center border-b bg-background/50 backdrop-blur">
      <div className="flex h-full w-full max-w-7xl items-center justify-between px-4 text-sm">
        <Link href={!user ? '/' : '/dashboard'}>
          <h1 className="text-xl font-semibold">Next.js Supabase MVP</h1>
        </Link>
        <AuthButton />
      </div>
    </nav>
  )
}
