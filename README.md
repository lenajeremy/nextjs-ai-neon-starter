# Neon Chat 🔥

This is a NextJS starter template that helps you build AI chat applications with ease. It makes it easy for you to select any AI provider with worrying about technical implementation. This helps you focus on building your product.

## Getting Started
You can iniailize a new Neon AI template by running the command
```bash
npx neonchat
```
and following the steps from the CLI.
> NOTE: The above method is the recommended one.

OR

- First, you have to clone the repository:
```bash
git clone https://github.com/lenajeremy/nextjs-ai-neon-starter
```

- Install the dependencies. Run the following command:
```bash
npm install
```

-Create a `.env` file in the root of your project and add the following environment variables:
```
DATABASE_URL=your_database_url
MAILERSEND_API_KEY=your_mailersend_api_key
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
LLM_KEY=your_llm_key
```

- Finally, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

### Components

- **Card Component**: A set of reusable UI components for creating card layouts.
  ```typescript:src/components/ui/card.tsx
  startLine: 1
  endLine: 76
  ```

- **Button Component**: A customizable button component with various styles and sizes.
  ```typescript:src/components/ui/button.tsx
  startLine: 1
  endLine: 57
  ```

- **Input Component**: A styled input component.
  ```typescript:src/components/ui/input.tsx
  startLine: 1
  endLine: 25
  ```

- **Label Component**: A label component for form elements.
  ```typescript:src/components/ui/label.tsx
  startLine: 1
  endLine: 26
  ```

- **Avatar Component**: A component for displaying user avatars.
  ```typescript:src/components/ui/avatar.tsx
  startLine: 1
  endLine: 50
  ```

- **Toaster Component**: A component for displaying toast notifications.
  ```typescript:src/components/ui/sonner.tsx
  startLine: 1
  endLine: 31
  ```

### Authentication

This project uses `next-auth` for authentication with GitHub and email providers.

- **Auth Configuration**:
  ```typescript:src/auth.ts
  startLine: 1
  endLine: 64
  ```

- **Sign-in Page**:
  ```typescript:src/app/(auth)/auth/signin/page.tsx
  startLine: 1
  endLine: 127
  ```

### API Routes

- **AI Chat API**:
  - Create a new conversation:
    ```typescript:src/app/api/ai/chats/new/route.ts
    startLine: 1
    endLine: 28
    ```
  - Get user conversations:
    ```typescript:src/app/api/ai/chats/user/route.ts
    startLine: 1
    endLine: 33
    ```
  - Get and update conversation by ID:
    ```typescript:src/app/api/ai/chats/[id]/route.ts
    startLine: 1
    endLine: 42
    ```
  - Chat route:
    ```typescript:src/app/api/ai/chat/route.ts
    startLine: 1
    endLine: 40
    ```

- **Auth API**:
  ```typescript:src/app/api/auth/[...nextauth]/route.ts
  startLine: 1
  endLine: 3
  ```

### Prisma
This project uses Prisma as the ORM for database interactions.

- **Prisma Client**:
  ```typescript:src/prisma.ts
  startLine: 1
  endLine: 7
  ```

- **Prisma Schema**:
  ```prisma:schema.prisma
  startLine: 1
  endLine: 70
  ```

### Configuration Files

- **Next.js Configuration**:
  ```next.config.mjs
  startLine: 1
  endLine: 5
  ```

- **Tailwind CSS Configuration**:
  ```typescript:tailwind.config.ts
  startLine: 1
  endLine: 80
  ```

- **PostCSS Configuration**:
  ```postcss.config.mjs
  startLine: 1
  endLine: 9
  ```

- **TypeScript Configuration**:
  ```json:tsconfig.json
  startLine: 1
  endLine: 27
  ```

- **ESLint Configuration**:
  ```json:.eslintrc.json
  startLine: 1
  endLine: 4
  ```

### Styles
- **Global Styles**:
  ```css:src/app/globals.css
  startLine: 1
  endLine: 69
  ```

### Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

