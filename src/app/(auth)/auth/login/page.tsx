'use client'

import React from 'react'
import {Button} from "@/components/ui/button";
import {signIn, useSession} from "next-auth/react";

function LoginPage() {
    const session = useSession()
    return (
        <div>
            <pre>{JSON.stringify(session, null, 3)}</pre>
            <Button onClick={() => signIn("github")}>Sign In</Button>
        </div>
    )
}

export default LoginPage;