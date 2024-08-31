'use client'

import { signIn } from "next-auth/react"

export default function SignInPage() {
  return (
    <div className="flex h-screen bg-gray-100">
        <button onSubmit={() => signIn('email')}>Sign In With Email</button>
      <button onClick={() => signIn('github')}>Sign in with Github</button>
    </div>
  )
}