"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
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

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

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

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
    body: {
      conversationId: currentConversation?.id,
    },
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Simulating fetching conversations from an API
    const mockConversations: Conversation[] = [
      {
        id: "1",
        title: "AI Basics Discussion",
        date: new Date("2023-06-10"),
        messages: [
          { text: "What are the basics of AI?", sender: "user" },
          {
            text: "AI, or Artificial Intelligence, refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect. The basics of AI include machine learning, neural networks, and deep learning.",
            sender: "bot",
          },
        ],
      },
      {
        id: "2",
        title: "Machine Learning Query",
        date: new Date("2023-06-12"),
        messages: [
          { text: "Can you explain machine learning?", sender: "user" },
          {
            text: "Machine Learning is a subset of AI that focuses on the development of computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples we provide.",
            sender: "bot",
          },
        ],
      },
    ];
    setConversations(mockConversations);
  }, []);

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      date: new Date(),
      messages: [],
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  useEffect(() => {
    // Scroll to bottom of message container when new messages are added
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [currentConversation?.messages]);

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
            alt="Lumina Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold">Lumina</h1>
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
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="justify-start w-full text-white hover:text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "ml-64 m-4 rounded-xl" : "ml-0 m-0 rounded-none"
        }`}
      >
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            className="bg-[#08193b] hover:bg-blue-600 text-white"
            onClick={startNewConversation}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </header>
        <main className="flex-1 p-6 flex flex-col bg-white">
          <div
            id="message-container"
            className="flex-1 bg-gray-50 rounded-2xl p-6 mb-4 overflow-y-auto"
          >
            {!currentConversation ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                  src="/image.png"
                  alt="Lumina Icon"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h2 className="text-2xl font-bold mb-4">Welcome to Lumina!</h2>
                <p className="text-center text-gray-600 max-w-md mb-8">
                  Lumina is your personal AI-powered assistant, ready to help
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
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar src="/image.png" alt="AI Avatar" />
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 mx-2 ${
                        message.role === "user"
                          ? "bg-[#08193b] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.content}
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
          <div className="flex items-center relative">
            <Input
              className="w-full pr-12 pl-4 py-6 rounded-full focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
