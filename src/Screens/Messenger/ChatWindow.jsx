import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Plus, Send, Mic, Download, ArrowLeft, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import axios from 'axios';

// 100% Real Socket Connection to TriNetra Backend
const socket = io('https://trinetra-umys.onrender.com');

export default function ChatWindow({ currentUser, friend, onBack, onStartCall }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load Real Chat History
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.post('https://trinetra-umys.onrender.com/api/chat/history', {
          user1: currentUser.trinetraId,
          user2: friend.trinetraId
        });
        if(res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.error(t("Failed to load history"));
      }
    };
    fetchChatHistory();

    // Socket: Join Private Room
    const room = [currentUser.trinetraId, friend.trinetraId].sort().join('_');
    socket.emit('join_room', room);

    // Socket: Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [currentUser, friend, t]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real Message Sender
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const messageData = {
      room: [currentUser.trinetraId, friend.trinetraId].sort().join('_'),
      senderId: currentUser.trinetraId,
      receiverId: friend.trinetraId,
      text: msgInput,
      mediaUrl: null,
      mediaType: null,
      timestamp: new Date().toISOString()
    };

    // Emit to real-time socket
    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setMsgInput('');

    // Save to DB via API
    try {
      await axios.post('https://trinetra-umys.onrender.com/api/chat/save', messageData);
    } catch (err) {
      console.error(t("Failed to save to DB"));
    }
  };

  // Real S3 Media Uploader + Universal Download Rule
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setShowAttach(false);

    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', currentUser.trinetraId);
    formData.append('uploadType', 'chat_media');

    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/chat/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const messageData = {
        room: [currentUser.trinetraId, friend.trinetraId].sort().join('_'),
        senderId: currentUser.trinetraId,
        receiverId: friend.trinetraId,
        text: '',
        mediaUrl: res.data.url,
        mediaType: type,
        timestamp: new Date().toISOString()
      };

      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      await axios.post('https://trinetra-umys.onrender.com/api/chat/save', messageData);

    } catch (err) {
      alert(t("Media upload failed."));
    } finally {
      setIsUploading(false);
    }
  };

  // Real Universal Download Function
  const downloadMedia = (mediaUrl) => {
    if (!mediaUrl) return;
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.target = '_blank';
    link.download = `TriNetra_Media_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white fixed inset-0 z-[60] font-sans">
      
      {/* Header with Real Calling Triggers */}
      <header className="p-4 bg-[#111827] flex justify-between items-center border-b border-gray-800 shadow-lg">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-90" />
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
             {friend.profilePic ? <img src={friend.profilePic} className="w-full h-full object-cover" alt="pfp" /> : <span className="font-bold">{friend.name?.charAt(0)}</span>}
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide">{friend.name}</h4>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{friend.isOnline ? t("Online") : t("Offline")}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-cyan-400">
          <Phone onClick={() => onStartCall(friend, 'Voice')} size={20} className="active:scale-90 transition-transform cursor-pointer" />
          <Video onClick={() => onStartCall(friend, 'Video')} size={20} className="active:scale-90 transition-transform cursor-pointer" />
        </div>
      </header>

      {/* Real Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {messages.map((m, index) => {
          const isMe = m.senderId === currentUser.trinetraId;
          return (
            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}>
              <div className={`p-3 max-w-[80%] shadow-lg ${isMe ? 'bg-cyan-600 text-black rounded-2xl rounded-tr-none' : 'bg-[#111827] text-white border border-gray-800 rounded-2xl rounded-tl-none'}`}>
                
                {/* Media Renderer with Universal Download */}
                {m.mediaUrl && (
                  <div className="w-48 h-48 bg-black rounded-lg mb-2 overflow-hidden relative group border border-black/20">
                    {m.mediaType === 'image' ? (
                      <img src={m.mediaUrl} className="w-full h-full object-cover" alt="media" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-cyan-400"><FileText size={40}/></div>
                    )}
                    <button 
                      onClick={() => downloadMedia(m.mediaUrl)}
                      className="absolute top-2 right-2 bg-black/80 p-1.5 rounded-lg border border-white/20 text-white hover:text-cyan-400 backdrop-blur-md"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                )}
                
                {m.text && <p className="text-sm font-medium break-words">{m.text}</p>}
                <span className={`text-[9px] mt-1 block ${isMe ? 'text-black/60 text-right' : 'text-gray-500'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        {isUploading && <div className="text-cyan-400 text-xs font-bold animate-pulse">{t("Uploading Media...")}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111827] border-t border-gray-800">
        <form onSubmit={sendMessage} className="flex items-center gap-3 relative">
          
          <div className="relative">
            <button type="button" onClick={() => setShowAttach(!showAttach)} className={`p-2 rounded-full transition-all ${showAttach ? 'bg-cyan-500 text-black rotate-45' : 'bg-gray-800 text-cyan-400'}`}>
              <Plus size={24} />
            </button>
            
            {showAttach && (
              <div className="absolute bottom-14 left-0 bg-[#111827] border border-gray-800 p-3 rounded-2xl flex gap-4 shadow-2xl">
                <label className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-blue-500 p-3 rounded-xl text-white"><ImageIcon size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Gallery")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-orange-500 p-3 rounded-xl text-white"><FileText size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Document")}</span>
                  <input type="file" accept=".pdf,.doc,.txt" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                </label>
              </div>
            )}
          </div>

          <div className="flex-1 bg-[#0a1014] border border-gray-800 rounded-2xl flex items-center px-4 py-1 focus-within:border-cyan-500 transition-all">
            <input 
              type="text" 
              placeholder={t("Type message...")}
              className="bg-transparent w-full py-2 text-sm focus:outline-none"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            {msgInput.length === 0 ? (
               <label className="cursor-pointer text-gray-500 hover:text-cyan-400"><Mic size={20}/><input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'audio')} /></label>
            ) : (
               <button type="submit" className="text-cyan-400 active:scale-90"><Send size={20} /></button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
