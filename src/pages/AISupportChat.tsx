import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCrisis?: boolean;
}

const TherapyChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm here to listen and support you. This is a safe space to explore your thoughts and feelings. What's on your mind today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectCrisis = (message: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 
      'self-harm', 'hurt myself', 'want to die'
    ];
    return crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  };

  const getCrisisResponse = (): string => {
    return `I'm very concerned about what you've shared. Your safety is the top priority right now.

**Please reach out to immediate help:**

• **National Suicide Prevention Lifeline:** Call or text 988 (US)
• **Crisis Text Line:** Text HOME to 741741
• **International:** https://findahelpline.com

If you're in immediate danger, please call emergency services (911 in US) or go to your nearest emergency room.

I'm here to listen, but I'm not equipped to handle crisis situations. A trained professional can provide the immediate support you need right now.`;
  };

  const getTherapeuticResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to your backend
    // Replace this with actual API call to your Python backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo therapeutic responses
    const responses = [
      "I hear you, and thank you for sharing that with me. It takes courage to open up. Can you tell me more about how this has been affecting you?",
      "That sounds really challenging. What emotions come up for you when you think about this situation?",
      "It seems like this is weighing heavily on you. How have you been coping with these feelings?",
      "I appreciate you trusting me with this. What would support look like for you right now?",
      "You've mentioned some important insights. What patterns do you notice in these thoughts or feelings?",
      "That's a lot to carry. Have you been able to talk to anyone else about this, or would you like to explore that?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const isCrisis = detectCrisis(inputMessage);
      let botResponseText: string;

      if (isCrisis) {
        botResponseText = getCrisisResponse();
      } else {
        // Replace this with actual API call:
        // const response = await fetch('http://localhost:5000/chat', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ message: inputMessage })
        // });
        // const data = await response.json();
        // botResponseText = data.response;
        
        botResponseText = await getTherapeuticResponse(inputMessage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        isCrisis
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewSession = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Welcome back. I'm here to listen. What would you like to talk about today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Important Disclaimer
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>This AI chatbot is <strong>NOT a replacement</strong> for professional therapy or mental health treatment.</p>
                  <p>• Cannot diagnose conditions</p>
                  <p>• Cannot prescribe treatment</p>
                  <p>• Cannot handle crisis situations</p>
                  <p className="text-amber-700 font-medium">
                    If you're in crisis, please contact emergency services or a crisis helpline immediately.
                  </p>
                  <p className="text-gray-700 mt-3">
                    For ongoing support, please consult a licensed mental health professional.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Therapy Assistant</h1>
              <p className="text-xs text-gray-500">A supportive space to explore your thoughts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Show disclaimer"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={startNewSession}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="New session"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : message.isCrisis
                    ? 'bg-red-50 text-red-900 border-2 border-red-200'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.text}
                </p>
                <span className={`text-xs mt-2 block ${
                  message.sender === 'user' 
                    ? 'text-purple-200' 
                    : message.isCrisis 
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is not a substitute for professional mental health care
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapyChatbot;