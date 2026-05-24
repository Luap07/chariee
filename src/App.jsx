import React, { useState, useEffect, useRef } from 'react'
import "./index.css"
import Navbar from './components/Navbar'
import { GoogleGenAI } from "@google/genai";
import { BeatLoader } from "react-spinners";
import Markdown from 'react-markdown'
import { RiComputerFill } from "react-icons/ri";
import { GiOpenBook, GiWhiteBook } from 'react-icons/gi';
import { FaBloggerB } from 'react-icons/fa';

// FIXED: Initialized outside the component lifecycle loop to keep context state secure
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const App = () => {
  const [screen, setScreen] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data, loading]);

  async function getResponse(currentPrompt) {
    const textToSend = currentPrompt || prompt;

    if (!textToSend.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setData(prevData => [...prevData, { role: "user", content: textToSend }]);
    setScreen(2);
    setPrompt(""); 
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: textToSend,
      });

      setData(prevData => [...prevData, { role: "ai", content: response.text }]);
    } catch (error) {
      console.error("GenAI Framework Error:", error);
      setData(prevData => [...prevData, { role: "ai", content: "Apologies, I encountered an issue computing that update." }]);
    } finally {
      setLoading(false);
    }
  }

  const handleCardClick = (suggestionText) => {
    getResponse(suggestionText);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* FIXED: Applied 'no-scrollbar' class name right into your tracking div wrapper layer */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full max-w-4xl mx-auto px-4 md:px-6">
        {
          screen === 1 ? (
            <div className="w-full h-full flex items-center justify-center flex-col py-10">
              <h3 className='text-5xl font-bold tracking-tight mb-8'>
                Chariee.<span className='text-blue-500'>ai</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                <div onClick={() => handleCardClick("Create a website using html css and js.")} className="card cursor-pointer bg-zinc-950 border border-zinc-900 transition-all hover:bg-zinc-900 rounded-xl p-5">
                  <i className='text-3xl text-blue-500'><RiComputerFill/></i>
                  <p className='mt-3 text-zinc-300 font-medium'>Create a website using html css and js.</p>
                </div>
                <div onClick={() => handleCardClick("Write a book for me. topic is coding.")} className="card cursor-pointer bg-zinc-950 border border-zinc-900 transition-all hover:bg-zinc-900 rounded-xl p-5">
                  <i className='text-3xl text-purple-500'><GiWhiteBook/></i>
                  <p className='mt-3 text-zinc-300 font-medium'>Write a book for me. topic is coding.</p>
                </div>
                <div onClick={() => handleCardClick("Tell me a comedy story.")} className="card cursor-pointer bg-zinc-950 border border-zinc-900 transition-all hover:bg-zinc-900 rounded-xl p-5">
                  <i className='text-3xl text-amber-500'><GiOpenBook/></i>
                  <p className='mt-3 text-zinc-300 font-medium'>Tell me a comedy story.</p>
                </div>
                <div onClick={() => handleCardClick("Create a blog for me topic is web dev.")} className="card cursor-pointer bg-zinc-950 border border-zinc-900 transition-all hover:bg-zinc-900 rounded-xl p-5">
                  <i className='text-3xl text-emerald-500'><FaBloggerB/></i>
                  <p className='mt-3 text-zinc-300 font-medium'>Create a blog for me topic is web dev.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-5 py-8">
              {
                data.map((item, index) => {
                  const isUser = item.role === "user";
                  return (
                    <div 
                      key={index} 
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] md:max-w-[75%] rounded-2xl px-5 py-4 text-[16px] leading-relaxed shadow-sm ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none'
                      }`}>
                        <p className='text-[11px] uppercase tracking-wider font-bold mb-1 opacity-60'>
                          {isUser ? "User" : "Chariee.ai"}
                        </p>
                        <div className="prose prose-invert max-w-none">
                          <Markdown>{item.content}</Markdown>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              {
                loading && (
                  <div className="flex justify-start pl-2">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 rounded-bl-none">
                      <BeatLoader size={10} color='#3b82f6' />
                    </div>
                  </div>
                )
              }
              <div ref={messagesEndRef} />
            </div>
          )
        }
      </div>

      {/* Persistent Input Terminal Block Layout */}
      <div className="pb-6 px-4 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <input 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getResponse();
                }
              }} 
              onChange={(e) => { setPrompt(e.target.value) }} 
              value={prompt} 
              type="text" 
              placeholder='Enter your prompt...' 
              className='flex-1 bg-transparent py-3 px-1 outline-none text-lg text-white placeholder:text-zinc-500' 
            />
          </div>
          <p className='text-zinc-600 text-xs text-center mt-3'>
            Chariee.ai can make mistakes! Double-check critical computations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App