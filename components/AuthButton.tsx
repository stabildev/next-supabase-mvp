import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return redirect('/')
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden sm:inline">Hey, {user.email}!</span>
      <form action={signOut}>
        <Button variant="outline">Logout</Button>
      </form>
    </div>
  ) : (
    <Link href="/login" className={buttonVariants()}>
      Login
    </Link>
  )
}
