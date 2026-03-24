import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Wallet, Paperclip, MoreVertical, Heart, MessageSquare, Send, Phone, Video, ArrowLeft, CheckCircle, Clock, MapPin, Image as ImageIcon, User, FileText, DownloadCloud, Smartphone, Monitor, Sparkles, Zap, X, Cpu, MessageCircle as ChatIcon, Terminal } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeChat, setActiveChat] = useState(null); 
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  // App Download Logic (Hide on App)
  const [isWebApp, setIsWebApp] = useState(true);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsWebApp(false);
    }
  }, []);

  const handleIOSDownload = () => {
    alert("For iOS (iPhone/iPad):\n1. Tap the 'Share' icon at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'.");
  };

  // === MASTER AI LOGIC (Dual Mode) ===
  const [aiMode, setAiMode] = useState('chat'); // 'chat' or 'agent'
  const [chatCredits, setChatCredits] = useState(5); // 5 Daily Free Msgs
  const [agentCredits, setAgentCredits] = useState(20); // 20 Free Credits
  const [showProModal, setShowProModal] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: 'TriNetra Master AI Online. Select your mode below: Standard Chat (5 free msgs/day) or Agent Mode for heavy coding/research (20 free credits).' }
  ]);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    
    // Check Limits based on Mode
    if (aiMode === 'chat' && chatCredits <= 0) {
      setShowProModal(true);
      return;
    }
    if (aiMode === 'agent' && agentCredits <= 0) {
      setShowProModal(true);
      return;
    }
    
    // Add User Message
    const newMsgs = [...aiMessages, { role: 'user', text: aiInput }];
    setAiMessages(newMsgs);
    setAiInput('');
    
    // Deduct Credits
    if (aiMode === 'chat') setChatCredits(prev => prev - 1);
    if (aiMode === 'agent') setAgentCredits(prev => prev - 1);

    // Simulate AI Response
    setTimeout(() => {
      let responseText = '';
      if (aiMode === 'chat') {
        responseText = chatCredits - 1 === 0 ? '⚠️ Daily free chat limit reached. Upgrade to Pro.' : '[Chat Mode] Analyzing your query...';
      } else {
        responseText = agentCredits - 1 === 0 ? '⚠️ Agent credits exhausted. Upgrade to Pro for autonomous tasks.' : '[Agent Mode] Initializing workspace, writing code, and running deep search...';
      }
      setAiMessages([...newMsgs, { role: 'ai', text: responseText }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {/* === HEADER === */}
      {activeTab === 'chat' && activeChat ? (
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
          <div className="flex items-center space-x-3">
            <ArrowLeft className="w-6 h-6 text-green-500 cursor-pointer" onClick={() => setActiveChat(null)} />
            <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="User" />
            <div>
              <h1 className="text-lg font-bold">{activeChat}</h1>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Video className="w-6 h-6 text-gray-300" />
            <Phone className="w-6 h-6 text-gray-300" />
            <MoreVertical className="w-6 h-6 text-gray-300" />
          </div>
        </header>
      ) : (
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
          <h1 className="text-2xl font-bold text-green-500 tracking-wider">
            {activeTab === 'home' && 'TriNetra'}
            {activeTab === 'reels' && 'TriNetra Reels'}
            {activeTab === 'chat' && 'Secure Chat'}
            {activeTab === 'wallet' && 'Agent Ledger'}
            {activeTab === 'ai' && 'Master AI'}
            {activeTab === 'download' && 'Download Center'}
          </h1>
          {activeTab === 'home' && (
            <div className="flex space-x-4">
              <Heart className="w-6 h-6 text-gray-300" />
              <MessageCircle className="w-6 h-6 text-gray-300" onClick={() => setActiveTab('chat')} />
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
              <Zap className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-xs font-bold">{aiMode === 'chat' ? `${chatCredits} Msgs` : `${agentCredits} Cr`} Left</span>
            </div>
          )}
        </header>
      )}

      {/* === PRO UPGRADE MODAL (AI Paid Plans) === */}
      {showProModal && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-green-900/20">
            <div className="p-4 bg-gradient-to-r from-gray-900 to-green-900/30 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Unlock TriNetra Pro</h2>
              </div>
              <X className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowProModal(false)} />
            </div>
            
            <div className="p-5">
              <p className="text-sm text-gray-300 mb-4">Get unlimited access to Master-Level AI: Infinite Chatbot & Unlimited Agent Credits for Coding/Research.</p>
              
              <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {[
                  { duration: '1 Month', price: '₹499', tag: 'Starter' },
                  { duration: '3 Months', price: '₹1,299', tag: 'Save 15%' },
                  { duration: '6 Months', price: '₹2,399', tag: 'Most Popular', highlight: true },
                  { duration: '9 Months', price: '₹3,499', tag: 'Pro Agent' },
                  { duration: '12 Months', price: '₹4,499', tag: 'Best Value (Save 25%)' }
                ].map((plan, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl border ${plan.highlight ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800'} cursor-pointer hover:border-green-400 transition`}>
                    <div>
                      <h3 className="font-bold text-lg flex items-center">
                        {plan.duration} 
                        {plan.highlight && <span className="ml-2 text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full uppercase font-bold">Hot</span>}
                      </h3>
                      <p className="text-xs text-gray-400">{plan.tag}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{plan.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition flex justify-center items-center shadow-lg shadow-green-600/30">
                <Zap className="w-5 h-5 mr-2" /> Upgrade to Pro Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        
        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div className="flex space-x-4 p-4 overflow-x-auto border-b border-gray-800 scrollbar-hide">
              <div className="flex flex-col items-center min-w-[70px]">
                <div className="w-16 h-16 rounded-full border-2 border-green-500 p-[2px]">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Your Story" className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-xs mt-1 text-gray-400">Your Story</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center min-w-[70px]">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-[2px]">
                    <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="Agent" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-xs mt-1 text-gray-400">Agent 00{i}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 mb-4 border-b border-gray-800">
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center space-x-2">
                  <img src="https://i.pravatar.cc/150?img=33" className="w-8 h-8 rounded-full" alt="User" />
                  <span className="font-semibold text-sm">Commander_X</span>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center border-y border-gray-700">
                <span className="text-gray-500">[ Target Image / Video Here ]</span>
              </div>
              <div className="p-3">
                <div className="flex space-x-4 mb-2">
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                  <MessageSquare className="w-6 h-6" />
                  <Send className="w-6 h-6" />
                </div>
                <p className="text-sm"><span className="font-bold mr-2">Commander_X</span>Target located. Need detailed PDF report.</p>
                
                <div className="mt-3 flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
                  <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full mr-2" alt="You" />
                  <input type="text" placeholder="Add a comment or PDF..." className="bg-transparent flex-1 text-sm outline-none text-white" />
                  <button className="text-green-400 hover:text-green-300 ml-2 flex items-center bg-gray-700 p-1.5 rounded-full">
                    <Paperclip className="w-4 h-4" /> 
                    <span className="text-[10px] ml-1 font-bold">PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REELS TAB */}
        {activeTab === 'reels' && (
          <div className="h-full bg-black relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
               <PlaySquare className="w-16 h-16 text-gray-600 mb-4" />
               <span className="text-gray-500 font-bold tracking-widest">[ REEL VIDEO PLAYING ]</span>
            </div>
            <div className="absolute right-4 bottom-24 flex flex-col space-y-6 items-center">
              <div className="flex flex-col items-center"><Heart className="w-8 h-8 text-white" /><span className="text-xs">12k</span></div>
              <div className="flex flex-col items-center"><MessageSquare className="w-8 h-8 text-white" /><span className="text-xs">450</span></div>
              <div className="flex flex-col items-center"><Send className="w-8 h-8 text-white" /><span className="text-xs">Share</span></div>
              <div className="flex flex-col items-center"><MoreVertical className="w-8 h-8 text-white" /></div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-2 mb-2">
                <img src="https://i.pravatar.cc/150?img=44" className="w-8 h-8 rounded-full" alt="User" />
                <span className="font-bold text-white shadow-md">Agent_Ghost</span>
                <button className="border border-white px-2 py-0.5 rounded text-xs font-bold">Follow</button>
              </div>
              <p className="text-sm text-white max-w-[80%]">Operation shadow drop completed successfully. #OSINT #TriNetra</p>
            </div>
          </div>
        )}

        {/* 3. CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {!activeChat ? (
              <div className="flex-1 bg-gray-950">
                {['Commander_X', 'Agent_Ghost', 'HQ_Control', 'Alpha_Team'].map((name, i) => (
                  <div key={i} onClick={() => setActiveChat(name)} className="flex items-center p-4 border-b border-gray-900 hover:bg-gray-900 cursor-pointer">
                    <img src={`https://i.pravatar.cc/150?img=${i + 30}`} className="w-12 h-12 rounded-full" alt={name} />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between"><h3 className="font-bold">{name}</h3><span className="text-xs text-gray-500">10:42 AM</span></div>
                      <p className="text-sm text-gray-400 truncate">Roger that. Sending the PDF report now.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-gray-950 bg-opacity-95" style={{ backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
                  <div className="self-start bg-gray-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl max-w-[80%]">
                     <p className="text-sm">Did you get the target's location?</p>
                     <span className="text-[10px] text-gray-400 float-right mt-1">10:40 AM</span>
                  </div>
                  <div className="self-end bg-green-900 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl max-w-[80%] border border-green-700">
                     <p className="text-sm">Yes. I will attach the PDF dossier and map location.</p>
                     <span className="text-[10px] text-green-300 float-right mt-1 flex items-center">10:42 AM <CheckCircle className="w-3 h-3 ml-1 text-blue-400" /></span>
                  </div>
                </div>

                <div className="p-2 bg-gray-900 border-t border-gray-800 relative">
                  {showAttachMenu && (
                    <div className="absolute bottom-16 left-4 bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 grid grid-cols-4 gap-4 w-[calc(100%-2rem)]">
                      <div className="flex flex-col items-center"><div className="bg-purple-500 p-3 rounded-full mb-1"><FileText className="w-6 h-6 text-white"/></div><span className="text-xs">Document</span></div>
                      <div className="flex flex-col items-center"><div className="bg-pink-500 p-3 rounded-full mb-1"><ImageIcon className="w-6 h-6 text-white"/></div><span className="text-xs">Gallery</span></div>
                      <div className="flex flex-col items-center"><div className="bg-green-500 p-3 rounded-full mb-1"><MapPin className="w-6 h-6 text-white"/></div><span className="text-xs">Location</span></div>
                      <div className="flex flex-col items-center"><div className="bg-blue-500 p-3 rounded-full mb-1"><User className="w-6 h-6 text-white"/></div><span className="text-xs">Contact</span></div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2 rounded-full hover:bg-gray-800 text-gray-400">
                      <Paperclip className="w-6 h-6" />
                    </button>
                    <input type="text" placeholder="Message..." className="flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none text-white border border-gray-700" />
                    <button className="p-3 bg-green-600 rounded-full hover:bg-green-500 text-white">
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. WALLET / AGENT LEDGER TAB */}
        {activeTab === 'wallet' && (
          <div className="p-4">
            <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800 flex justify-between items-center shadow-lg shadow-green-900/20">
               <div>
                 <p className="text-gray-400 text-sm">Total Network Payouts</p>
                 <h2 className="text-3xl font-bold text-green-500">₹ 4,50,000</h2>
               </div>
               <Wallet className="w-12 h-12 text-gray-700" />
            </div>

            <h3 className="font-bold text-gray-300 mb-4 px-1">Agent Payment Ledger</h3>
            <div className="space-y-3">
               <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="Agent" />
                   <div><p className="font-bold">Commander_X</p><p className="text-xs text-gray-500">Task: Target Locating</p></div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-green-500">₹ 25,000</p>
                   <p className="text-xs flex items-center justify-end text-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Paid</p>
                 </div>
               </div>
               <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <img src="https://i.pravatar.cc/150?img=44" className="w-10 h-10 rounded-full" alt="Agent" />
                   <div><p className="font-bold">Agent_Ghost</p><p className="text-xs text-gray-500">Task: Social Recon</p></div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-yellow-500">₹ 15,000</p>
                   <p className="text-xs flex items-center justify-end text-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* 5. MASTER AI TAB (Dual Mode) */}
        {activeTab === 'ai' && (
          <div className="h-full flex flex-col bg-gray-950">
            
            {/* AI Mode Selector */}
            <div className="flex justify-center p-3 bg-gray-900 border-b border-gray-800">
              <div className="flex bg-gray-800 rounded-full p-1 border border-gray-700">
                <button 
                  onClick={() => setAiMode('chat')}
                  className={`flex items-center px-4 py-1.5 rounded-full text-sm font-bold transition ${aiMode === 'chat' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <ChatIcon className="w-4 h-4 mr-2" /> Chatbot
                </button>
                <button 
                  onClick={() => setAiMode('agent')}
                  className={`flex items-center px-4 py-1.5 rounded-full text-sm font-bold transition ${aiMode === 'agent' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Terminal className="w-4 h-4 mr-2" /> Agent
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${aiMode === 'agent' ? 'bg-blue-900 border-blue-500' : 'bg-green-900 border-green-500'} border`}><Cpu className={`w-4 h-4 ${aiMode === 'agent' ? 'text-blue-400' : 'text-green-400'}`} /></div>}
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-br-sm' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-gray-900 border-t border-gray-800">
              <div className="flex items-center bg-gray-800 rounded-2xl p-1 border border-gray-700">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiSend()}
                  placeholder={
                    (aiMode === 'chat' && chatCredits > 0) ? "Ask AI anything..." :
                    (aiMode === 'agent' && agentCredits > 0) ? "Command Agent to build/research..." :
                    "Upgrade to Pro..."
                  }
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-white" 
                  disabled={(aiMode === 'chat' && chatCredits <= 0 && !showProModal) || (aiMode === 'agent' && agentCredits <= 0 && !showProModal)}
                />
                <button 
                  onClick={handleAiSend}
                  className={`p-2 rounded-xl flex items-center justify-center transition ${
                    (aiMode === 'chat' && chatCredits > 0) || (aiMode === 'agent' && agentCredits > 0) 
                    ? (aiMode === 'agent' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500') + ' text-white' 
                    : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. DOWNLOAD CENTER TAB */}
        {activeTab === 'download' && isWebApp && (
          <div className="p-4 flex flex-col items-center justify-center min-h-full text-center pb-20">
            <DownloadCloud className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Get TriNetra App</h2>
            <p className="text-gray-400 text-sm mb-8 px-4">Download the secure application for your platform to access full agent capabilities.</p>
            
            <div className="w-full max-w-sm space-y-4">
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-green-900 p-4 rounded-xl transition"><div className="flex items-center"><Smartphone className="w-6 h-6 mr-3 text-green-500" /> <span className="font-bold">Android (APK)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
              <button onClick={handleIOSDownload} className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-xl transition text-left"><div className="flex items-center"><Smartphone className="w-6 h-6 mr-3 text-white" /> <span className="font-bold">iOS (iPhone/iPad)</span></div><span className="text-xs text-green-500 border border-green-500 px-2 py-1 rounded">Web App</span></button>
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-blue-900 p-4 rounded-xl transition"><div className="flex items-center"><Monitor className="w-6 h-6 mr-3 text-blue-500" /> <span className="font-bold">Windows (EXE)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-xl transition"><div className="flex items-center"><Monitor className="w-6 h-6 mr-3 text-gray-300" /> <span className="font-bold">macOS (DMG)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-orange-900 p-4 rounded-xl transition"><div className="flex items-center"><Monitor className="w-6 h-6 mr-3 text-orange-500" /> <span className="font-bold">Linux (AppImage)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
            </div>
          </div>
        )}

      </main>

      {/* === BOTTOM NAVIGATION BAR === */}
      {!activeChat && (
        <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-between px-2 py-3 pb-5 z-50 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'home' ? 'text-green-500' : 'text-gray-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold">Home</span>
          </button>
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'reels' ? 'text-green-500' : 'text-gray-500'}`}>
            <PlaySquare className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold">Reels</span>
          </button>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-500'}`}>
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold">Chat</span>
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'wallet' ? 'text-green-500' : 'text-gray-500'}`}>
            <Wallet className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold">Wallet</span>
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'ai' ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-gray-500'}`}>
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold">Master AI</span>
          </button>
          {isWebApp && (
            <button onClick={() => setActiveTab('download')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'download' ? 'text-green-500' : 'text-gray-500'}`}>
              <DownloadCloud className="w-5 h-5" />
              <span className="text-[9px] mt-1 font-semibold">App</span>
            </button>
          )}
        </nav>
      )}

    </div>
  );
}
