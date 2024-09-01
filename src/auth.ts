import NextAuth, { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { prisma } from "@/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verificationMailHTML, verificationMailText } from '@/utils/mail';


const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || "",
});


async function sendVerificationRequest(params: SendVerificationRequestParams): Promise<void | undefined> {
    const { identifier, url, provider, theme } = params
    const { host } = new URL(url)
    const recipients = [
        new Recipient(identifier)
    ];
    const sender = new Sender(provider.from, "Founder of Really Cool Product");

    const emailParams = new EmailParams()
        .setFrom(sender)
        .setTo(recipients)
        .setReplyTo(sender)
        .setSubject(`Sign in to ${host}`)
        .setHtml(verificationMailHTML({ url, host, theme }))
        .setText(verificationMailText({ url, host }));


    const res = await mailerSend.email.send(emailParams);

    if (res.statusCode >= 400) {
        throw new Error(`Verification email could not be sent`)
    }
}



const Email = EmailProvider({
    type: "email",
    sendVerificationRequest,
    from: "no-reply@trial-z86org8660z4ew13.mlsender.net"
})

const Github = GithubProvider({
    clientId: process.env.AUTH_GITHUB_ID || "",
    clientSecret: process.env.AUTH_GITHUB_SECRET || "",
})

export const authOptions: AuthOptions = {
    // @ts-ignore
    adapter: PrismaAdapter(prisma),
    providers: [Email, Github],
    debug: true,
    session: {
        strategy: 'jwt',
    }
}

const auth = NextAuth(authOptions)

export default auth