import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Wallet, Paperclip, MoreVertical, Heart, MessageSquare, Send, Phone, Video, ArrowLeft, CheckCircle, Clock, MapPin, Image as ImageIcon, User, FileText, DownloadCloud, Smartphone, Monitor, Sparkles, Zap, X, Cpu, MessageCircle as ChatIcon, Terminal, Globe, Code, Key, Github, Database, GitBranch } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeChat, setActiveChat] = useState(null); 
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  // App Download Logic
  const [isWebApp, setIsWebApp] = useState(true);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsWebApp(false);
    }
  }, []);

  const handleIOSDownload = () => {
    alert("For iOS (iPhone):\n1. Tap the 'Share' icon at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen'.");
  };

  // === AI LOGIC (6 AIs + 3 Repos) ===
  const [aiMainMode, setAiMainMode] = useState('chatbot'); 
  const [aiSubMode, setAiSubMode] = useState('basic'); 
  const [selectedRepo, setSelectedRepo] = useState('github'); // github, gitlab, bitbucket
  
  const [masterChatCredits, setMasterChatCredits] = useState(5); 
  const [agentCredits, setAgentCredits] = useState(20); 
  const [showProModal, setShowProModal] = useState(false);
  
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: 'TriNetra Master AI Online. [Engine: Meta/GPT/Gemini/DeepSeek/Manus/Emergent].\nReady for input.' }
  ]);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    
    // Limits
    if (aiMainMode === 'chatbot' && aiSubMode === 'master' && masterChatCredits <= 0) {
      setShowProModal(true); return;
    }
    if (aiMainMode === 'agent' && agentCredits <= 0) {
      setShowProModal(true); return;
    }
    
    const newMsgs = [...aiMessages, { role: 'user', text: aiInput }];
    setAiMessages(newMsgs);
    setAiInput('');
    
    // Deduct
    if (aiMainMode === 'chatbot' && aiSubMode === 'master') setMasterChatCredits(prev => prev - 1);
    if (aiMainMode === 'agent') setAgentCredits(prev => prev - 1);

    // AI Response Simulation
    setTimeout(() => {
      let responseText = '';
      if (aiMainMode === 'chatbot') {
        if (aiSubMode === 'basic') {
          responseText = '[Basic Chat | Meta AI Engine] Query resolved. (Lifetime Free)';
        } else {
          responseText = masterChatCredits - 1 === 0 
            ? '⚠️ Master Chat Limit Reached. Upgrade for unlimited GPT/Gemini/DeepSeek power.' 
            : '[Master Chat | ChatGPT/Gemini/DeepSeek Combined] Analyzing complex multi-layered query...';
        }
      } else {
        const repoName = selectedRepo === 'github' ? 'GitHub' : selectedRepo === 'gitlab' ? 'GitLab' : 'Bitbucket';
        if (aiSubMode === 'general') {
          responseText = agentCredits - 1 === 0 
            ? '⚠️ Agent Credits Exhausted. Upgrade to Pro.' 
            : `[General Agent | Manus Engine] Executing autonomous task. Connecting to ${repoName} repository. Scraping data and writing backend logic...`;
        } else {
          responseText = agentCredits - 1 === 0 
            ? '⚠️ Agent Credits Exhausted. Upgrade to Pro.' 
            : `[Vibe Coding | Emergent Engine] Connected to ${repoName}. Generating App.jsx, committing changes, and triggering CI/CD pipeline...`;
        }
      }
      setAiMessages([...newMsgs, { role: 'ai', text: responseText }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {/* === HEADER === */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
        <h1 className="text-2xl font-bold text-green-500 tracking-wider">
          {activeTab === 'home' && 'TriNetra'}
          {activeTab === 'reels' && 'TriNetra Reels'}
          {activeTab === 'chat' && 'Secure Chat'}
          {activeTab === 'wallet' && 'API Control Center'}
          {activeTab === 'ai' && 'TriNetra Master AI'}
          {activeTab === 'download' && 'Download Center'}
        </h1>
        {activeTab === 'ai' && (
          <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <Zap className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-xs font-bold">
              {aiMainMode === 'chatbot' ? (aiSubMode === 'basic' ? 'Free' : `${masterChatCredits} Msgs`) : `${agentCredits} Cr`}
            </span>
          </div>
        )}
      </header>

      {/* === PRO UPGRADE MODAL === */}
      {showProModal && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-green-900/20">
            <div className="p-4 bg-gradient-to-r from-gray-900 to-green-900/30 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center space-x-2"><Sparkles className="w-6 h-6 text-green-400" /><h2 className="text-xl font-bold text-white">TriNetra Pro Subscription</h2></div>
              <X className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowProModal(false)} />
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-300 mb-4">Unlock the power of 6 AIs. Unlimited Master Chat, Unlimited Autonomous Agents, and get your Developer API Key.</p>
              <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto scrollbar-hide">
                {[
                  { duration: '1 Month', price: '₹499', tag: 'Starter' },
                  { duration: '3 Months', price: '₹1,299', tag: 'Save 15%' },
                  { duration: '6 Months', price: '₹2,399', tag: 'Most Popular', highlight: true },
                  { duration: '9 Months', price: '₹3,499', tag: 'Pro Agent' },
                  { duration: '12 Months', price: '₹4,499', tag: 'Best Value' }
                ].map((plan, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl border ${plan.highlight ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800'} cursor-pointer hover:border-green-400 transition`}>
                    <div><h3 className="font-bold text-lg">{plan.duration}</h3><p className="text-xs text-gray-400">{plan.tag}</p></div>
                    <p className="text-xl font-bold text-white">{plan.price}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition flex justify-center items-center"><Zap className="w-5 h-5 mr-2" /> Upgrade & Unlock Features</button>
            </div>
          </div>
        </div>
      )}

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        
        {/* Plaeholders for UI */}
        {activeTab === 'home' && <div className="p-4 text-center text-gray-500 mt-20">Home Screen (Story/Post + PDF) Active</div>}
        {activeTab === 'reels' && <div className="p-4 text-center text-gray-500 mt-20">Reels Screen Active</div>}
        {activeTab === 'chat' && <div className="p-4 text-center text-gray-500 mt-20">Secure Chat Active</div>}

        {/* 4. WALLET & API CONTROL CENTER (The Brains) */}
        {activeTab === 'wallet' && (
          <div className="p-4 space-y-6">
            
            {/* 1. Generate TriNetra Key for Users */}
            <div className="bg-gray-900 rounded-xl p-5 border border-purple-900/50 relative">
               <div className="absolute top-0 right-0 bg-purple-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">SELL YOUR API</div>
               <div className="flex items-center space-x-3 mb-4"><div className="bg-purple-900/50 p-3 rounded-lg"><Key className="w-6 h-6 text-purple-400" /></div><div><h3 className="font-bold text-white">TriNetra Dev Key</h3><p className="text-xs text-gray-400">Use TriNetra Engine in 3rd party apps.</p></div></div>
               <div className="bg-black/50 border border-gray-800 rounded-lg p-3 flex justify-between"><code className="text-xs text-green-400 blur-[3px]">trinetra-sk-xxxxxxxx</code><button onClick={() => setShowProModal(true)} className="bg-purple-600 hover:bg-purple-500 text-xs px-3 py-1 rounded font-bold">Reveal</button></div>
            </div>

            {/* 2. Admin API Keys Setup (Connect the 6 AIs) */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
               <h3 className="font-bold text-white mb-4 border-b border-gray-800 pb-2">Admin Backend Setup (Engine Keys)</h3>
               <div className="space-y-3">
                 <div>
                   <label className="text-xs text-gray-400">GitHub / GitLab / Bitbucket PAT Token</label>
                   <input type="password" placeholder="ghp_xxxx..." className="w-full bg-black/50 border border-gray-700 rounded p-2 text-xs mt-1 outline-none focus:border-green-500 text-green-400"/>
                 </div>
                 <div>
                   <label className="text-xs text-gray-400">OpenAI / DeepSeek API Key</label>
                   <input type="password" placeholder="sk-xxxx..." className="w-full bg-black/50 border border-gray-700 rounded p-2 text-xs mt-1 outline-none focus:border-green-500 text-green-400"/>
                 </div>
                 <div>
                   <label className="text-xs text-gray-400">Google Gemini 3.1 Pro API Key</label>
                   <input type="password" placeholder="AIzaSy..." className="w-full bg-black/50 border border-gray-700 rounded p-2 text-xs mt-1 outline-none focus:border-green-500 text-green-400"/>
                 </div>
                 <button className="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded mt-2 border border-gray-600">Save Engine Keys to Backend</button>
               </div>
            </div>

            {/* Agent Ledger */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
              <div><p className="font-bold">Total Agent Payouts</p><p className="text-xs text-gray-500">Live Ledger</p></div>
              <p className="font-bold text-green-500">₹ 4,50,000</p>
            </div>
          </div>
        )}

        {/* 5. MASTER AI TAB (The 6-in-1 Engine) */}
        {activeTab === 'ai' && (
          <div className="h-full flex flex-col bg-gray-950">
            
            {/* Top Level Mode Selector */}
            <div className="flex justify-center p-2 bg-gray-900 border-b border-gray-800">
              <div className="flex bg-gray-800 rounded-lg p-1 w-full max-w-sm">
                <button onClick={() => { setAiMainMode('chatbot'); setAiSubMode('basic'); }} className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${aiMainMode === 'chatbot' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                  <ChatIcon className="w-4 h-4 mr-2" /> Chatbots
                </button>
                <button onClick={() => { setAiMainMode('agent'); setAiSubMode('general'); }} className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-bold transition ${aiMainMode === 'agent' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                  <Terminal className="w-4 h-4 mr-2" /> Autonomous Agents
                </button>
              </div>
            </div>

            {/* Sub-Mode Selector */}
            <div className="bg-gray-950 p-2 flex flex-col items-center border-b border-gray-900 space-y-2">
              {aiMainMode === 'chatbot' ? (
                <div className="flex space-x-2">
                  <button onClick={() => setAiSubMode('basic')} className={`px-4 py-1 text-xs font-bold rounded-full border ${aiSubMode === 'basic' ? 'bg-gray-800 border-gray-500 text-white' : 'border-transparent text-gray-500'}`}><Globe className="w-3 h-3 inline mr-1"/> Basic (Meta)</button>
                  <button onClick={() => setAiSubMode('master')} className={`px-4 py-1 text-xs font-bold rounded-full border ${aiSubMode === 'master' ? 'bg-green-900 border-green-500 text-green-400' : 'border-transparent text-gray-500'}`}><Sparkles className="w-3 h-3 inline mr-1"/> Master (GPT/Gemini/DeepSeek)</button>
                </div>
              ) : (
                <>
                  <div className="flex space-x-2">
                    <button onClick={() => setAiSubMode('general')} className={`px-4 py-1 text-xs font-bold rounded-full border ${aiSubMode === 'general' ? 'bg-blue-900 border-blue-500 text-blue-400' : 'border-transparent text-gray-500'}`}><Monitor className="w-3 h-3 inline mr-1"/> General (Manus)</button>
                    <button onClick={() => setAiSubMode('coding')} className={`px-4 py-1 text-xs font-bold rounded-full border ${aiSubMode === 'coding' ? 'bg-purple-900 border-purple-500 text-purple-400' : 'border-transparent text-gray-500'}`}><Code className="w-3 h-3 inline mr-1"/> Vibe Coding (Emergent)</button>
                  </div>
                  {/* Repo Selector for Agents */}
                  <div className="flex space-x-3 text-[10px] mt-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    <span className="text-gray-500 font-bold">Connect:</span>
                    <button onClick={() => setSelectedRepo('github')} className={`${selectedRepo === 'github' ? 'text-white' : 'text-gray-600'} flex items-center`}><Github className="w-3 h-3 mr-1"/> GitHub</button>
                    <button onClick={() => setSelectedRepo('gitlab')} className={`${selectedRepo === 'gitlab' ? 'text-orange-400' : 'text-gray-600'} flex items-center`}><GitBranch className="w-3 h-3 mr-1"/> GitLab</button>
                    <button onClick={() => setSelectedRepo('bitbucket')} className={`${selectedRepo === 'bitbucket' ? 'text-blue-400' : 'text-gray-600'} flex items-center`}><Database className="w-3 h-3 mr-1"/> Bitbucket</button>
                  </div>
                </>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center mr-2 flex-shrink-0"><Cpu className="w-4 h-4 text-white" /></div>}
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-br-sm' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-sm whitespace-pre-wrap'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-gray-900 border-t border-gray-800">
              <div className="flex items-center bg-gray-800 rounded-2xl p-1 border border-gray-700">
                <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiSend()}
                  placeholder={
                    aiMainMode === 'chatbot' 
                      ? (aiSubMode === 'basic' ? "Message Basic AI (Free)..." : "Message Master AI...")
                      : (aiSubMode === 'general' ? `Command Manus on ${selectedRepo}...` : `Command Emergent on ${selectedRepo}...`)
                  }
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-white" 
                />
                <button onClick={handleAiSend} className="p-2 rounded-xl bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}

        {/* 6. DOWNLOAD CENTER TAB */}
        {activeTab === 'download' && isWebApp && (
          <div className="p-4 flex flex-col items-center justify-center min-h-full text-center pb-20">
            <DownloadCloud className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Get TriNetra App</h2>
            <div className="w-full max-w-sm space-y-4 mt-8">
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-green-900 p-4 rounded-xl transition"><div className="flex items-center"><Smartphone className="w-6 h-6 mr-3 text-green-500" /> <span className="font-bold">Android (APK)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
              <button onClick={handleIOSDownload} className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-700 p-4 rounded-xl transition text-left"><div className="flex items-center"><Smartphone className="w-6 h-6 mr-3 text-white" /> <span className="font-bold">iOS (iPhone)</span></div><span className="text-xs text-green-500 border border-green-500 px-2 py-1 rounded">Web App</span></button>
              <a href="#" className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-blue-900 p-4 rounded-xl transition"><div className="flex items-center"><Monitor className="w-6 h-6 mr-3 text-blue-500" /> <span className="font-bold">Windows (EXE)</span></div><DownloadCloud className="w-5 h-5 text-gray-400" /></a>
            </div>
          </div>
        )}

      </main>

      {/* === BOTTOM NAVIGATION BAR === */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-between px-2 py-3 pb-5 z-50 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'home' ? 'text-green-500' : 'text-gray-500'}`}><Home className="w-5 h-5" /><span className="text-[9px] mt-1 font-semibold">Home</span></button>
        <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'reels' ? 'text-green-500' : 'text-gray-500'}`}><PlaySquare className="w-5 h-5" /><span className="text-[9px] mt-1 font-semibold">Reels</span></button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-500'}`}><MessageCircle className="w-5 h-5" /><span className="text-[9px] mt-1 font-semibold">Chat</span></button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'wallet' ? 'text-green-500' : 'text-gray-500'}`}><Wallet className="w-5 h-5" /><span className="text-[9px] mt-1 font-semibold">API/Wallet</span></button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'ai' ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-gray-500'}`}><Sparkles className="w-5 h-5" /><span className="text-[9px] mt-1 font-semibold">Master AI</span></button>
      </nav>

    </div>
  );
}
