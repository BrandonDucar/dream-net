import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap, Brain, MessageSquare } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatGPTChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Welcome to the DreamNet Agent Hive. I am the orchestrator of your custom GPT fleet. How can I assist your sovereign operations today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate Agent Response
        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Vector analysis complete. I've coordinated with the Octopus and Aegis fleets. Your request regarding "${input}" is being processed through the neural mesh. Standing by for next directive.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden font-mono">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Brain className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-tighter uppercase italic">Agent_Hive_GPT</h3>
                        <div className="flex items-center gap-2 text-[8px] text-purple-400 font-bold tracking-widest uppercase mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                            Neural_Link: Active
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest">
                        v4.0_Omni
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'user'
                                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                        : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                    }`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-[11px] leading-relaxed tracking-tight ${msg.role === 'user'
                                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100 rounded-tr-none'
                                        : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'
                                    } shadow-xl`}>
                                    {msg.content}
                                    <div className="mt-2 text-[7px] opacity-30 font-bold uppercase tracking-widest">
                                        {msg.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                            <Bot size={14} />
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative group"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ENTER_DIRECTIVE..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-xs text-white placeholder:text-gray-700 focus:border-purple-500/50 focus:outline-none transition-all focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl text-white hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                        <Send size={14} />
                    </button>
                </form>
                <div className="mt-4 flex gap-4 text-[8px] font-black text-gray-600 uppercase tracking-widest justify-center">
                    <span className="flex items-center gap-1.5"><Sparkles size={10} className="text-purple-500" /> GPT_COORD_ON</span>
                    <span className="flex items-center gap-1.5"><Zap size={10} className="text-blue-500" /> HIGH_FREQ_ON</span>
                </div>
            </div>
        </div>
    );
}
