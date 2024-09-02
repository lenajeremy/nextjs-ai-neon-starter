"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { signOut } from "next-auth/react";
import {
  MessageCircle,
  FileQuestion,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  Brain,
  Send,
} from "lucide-react";
import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
}

interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

type UserConversationResponse = Array<{
  createdAt: string;
  updatedAt: string;
  id: string;
  messages: Message[];
  title: string;
}>;

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          className="w-2 h-2 bg-gray-400 rounded-full animate-loading-dot"
          style={{ animationDelay: `${delay}s` }}
        ></div>
      ))}
    </div>
  );
};

const Avatar = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <Image src={src} alt={alt} width={32} height={32} />
    </div>
  );
};

const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      ul({ children, ...props }) {
        return <ul className="list-disc list-outside ml-6">{children}</ul>;
      },
      ol({ children, ...props }) {
        return <ol className="list-decimal list-outside ml-6">{children}</ol>;
      },
      li({ children, ...props }) {
        return <li className="list-item my-1.5 text-sm">{children}</li>;
      },
      br({ children, ...props }) {
        return <br {...props} />;
      },
      code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <pre className="bg-gray-100 rounded p-2 my-3 overflow-x-auto text-sm">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        ) : (
          <code className={`text-sm ${className}`} {...props}>
            {children}
          </code>
        );
      },
      p({ children }) {
        return <p className="text-sm leading-6">{children}</p>;
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

export default function Component() {
  const session = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    initialMessages: currentConversation?.messages || [],
    api: "/api/ai/chat",
    body: {
      conversationId: currentConversation?.id,
    },
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  React.useEffect(() => {
    const getUserConversations = async () => {
      const res = await fetch("/api/ai/chats/user");
      const conversations = (await res.json()) as UserConversationResponse;
      setConversations(
        conversations
          .map((c) => ({
            date: new Date(c.updatedAt),
            id: c.id,
            title: c.title,
            messages: c.messages,
          }))
          .sort((a, b) => (a.date > b.date ? -1 : 1))
      );
    };

    getUserConversations();
  }, []);

  const startNewConversation = async () => {
    const response = await fetch("/api/ai/chats/new", { method: "POST" });
    const c = await response.json();

    const newConversation = {
      id: c.id,
      title: c.title,
      date: new Date(c.updatedAt),
      messages: c.messages,
    };

    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    // update the chat
    setMessages(conversation.messages);
  };

  const messageContainerRef = useRef<HTMLDivElement>(null);

  const saveConversation = async (id: string, messages: Message[]) => {
    try {
      const res = await fetch(`/api/ai/chats/${id}`, {
        method: "PUT",
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        toast.error("Error saving conversation");
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
      // @ts-ignore
      toast.error("Error saving conversation", { description: error.message });
    }
  };

  useEffect(() => {
    // Scroll to bottom of message container when new messages are added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }

    const lastMessage = messages.at(messages.length - 1);

    if (
      lastMessage &&
      lastMessage.role == "assistant" &&
      !isLoading &&
      currentConversation
    ) {
      saveConversation(currentConversation.id, messages as Message[]);
    }
  }, [messages, isLoading, currentConversation]);

  if (session.status == "loading") {
    return <div>Loading...</div>;
  }

  if (session.status === "unauthenticated") {
    return redirect("/auth/signin");
  }

  return (
    <div
      className={`flex h-screen bg-gray-100 ${GeistSans.className}`}
      style={{
        background: "radial-gradient(circle at center left, #010b49, #000000)",
      }}
    >
      <div
        className={`w-64 text-white p-4 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 bottom-0 z-50`}
      >
        <div className="flex items-center mb-8">
          <Image
            src="/image.png"
            alt="NeonChat Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold">NeonChat</h1>
        </div>
        <h2 className="text-xs font-semibold mb-2 text-gray-400">
          CONVERSATIONS
        </h2>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className="justify-start mb-2 w-full text-white hover:text-white hover:bg-white/10"
              onClick={() => selectConversation(conversation)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {conversation.title}
            </Button>
          ))}
        </div>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="justify-start mb-2 w-full text-white hover:text-white hover:bg-white/10"
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            FAQ
          </Button>
          <Button
            variant="ghost"
            className="justify-start mb-2 w-full text-white hover:text-white hover:bg-white/10"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </Button>
          <Button
            variant="ghost"
            className="justify-start mb-2 w-full text-white hover:text-white hover:bg-white/10"
            // onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="justify-start w-full text-white hover:text-white hover:bg-white/10"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden ${
          sidebarOpen ? "ml-64 m-4 rounded-xl" : "ml-0 m-0 rounded-none"
        }`}
      >
        <header className="bg-white p-4 flex justify-between items-center border-b absolute w-full top-0 left-0 right-0">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            className="bg-[#08193b] hover:bg-blue-900 text-white"
            onClick={startNewConversation}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </header>
        <main
          ref={messageContainerRef}
          className="flex-1 p-6 pb-0 flex flex-col bg-white mt-[69px] h-[calc(100%-69px)] overflow-scroll scroll-smooth"
        >
          <div className="flex-1 bg-gray-50 rounded-2xl p-6 mb-4">
            {!currentConversation ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                  src="/image.png"
                  alt="NeonChat Icon"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h2 className="text-2xl font-bold mb-4">
                  Welcome to NeonChat!
                </h2>
                <p className="text-center text-gray-600 max-w-md mb-8">
                  NeonChat is your personal AI-powered assistant, ready to help
                  you navigate your day and provide valuable insights.
                  We&apos;re here to make your life easier. Let&apos;s get
                  started on this exciting journey together!
                </p>
                <div className="grid grid-cols-1 gap-4  max-w-md">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Natural Language Conversations
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Knowledge Base
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar src="/image.png" alt="AI Avatar" />
                    )}
                    <div
                      className={`max-w-[75%] rounded-3xl p-3 mx-2 ${
                        message.role === "user"
                          ? "bg-[#08193b] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <MarkdownContent content={message.content} />
                    </div>
                    {message.role === "user" && (
                      <Avatar src="/user.png" alt="User Avatar" />
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start justify-start">
                    <Avatar src="/image.png" alt="AI Avatar" />
                    <div className="bg-gray-200 text-gray-800 rounded-lg p-3 mx-2">
                      <LoadingDots />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <div className="bg-white p-6 pt-0">
          <div className="flex items-center relative ">
            <Input
              className="w-full pr-12 pl-4 py-6 rounded-full focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              size="icon"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
