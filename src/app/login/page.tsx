import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/dashboard')
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="flex w-full flex-1 flex-col justify-center gap-6 text-foreground animate-in"
        action={signIn}
      >
        {searchParams?.message && (
          <p className="mb-4 rounded-md bg-muted p-4 text-center text-muted-foreground dark:bg-muted/50">
            {searchParams.message}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <Label className="text-md" htmlFor="email">
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-md" htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <Button className="mt-4">Sign In</Button>

        <Button variant="outline" formAction={signUp}>
          Sign Up
        </Button>
      </form>
    </div>
  )
}
