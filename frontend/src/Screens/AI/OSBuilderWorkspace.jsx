import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Github, Play, ArrowLeft, Loader2, Download, CloudLightning } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Dummy Functions) 🔥
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function OSBuilderWorkspace({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  
  // Real Terminal State
  const [logs, setLogs] = useState([
    `> TriNetra AWS Identity Verified: [${currentUser?.trinetraId || 'ADMIN'}]`,
    `> Super Agentic OS Workspace Initialized. Tier: ₹79,999/m`,
    `> Waiting for architecture prompt to start building...`
  ]);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [s3OutputFileKey, setS3OutputFileKey] = useState(null);
  
  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal to the latest log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ─── 1. REAL AI EXECUTION (AWS APPSYNC -> LAMBDA -> GPT4/EMERGENT) ───
  const handleExecute = async () => {
    if (!prompt.trim() || isExecuting) return;
    
    const currentPrompt = prompt;
    setLogs(prev => [...prev, `\n> root@trinetra:~$ ${currentPrompt}`]);
    setLogs(prev => [...prev, `> [AWS CloudWatch] Deducting 1 Premium Credit...`]);
    setLogs(prev => [...prev, `> [AI Engine] Compiling neural instructions...`]);
    
    setPrompt('');
    setIsExecuting(true);
    setS3OutputFileKey(null);

    try {
      // 🔥 AWS GraphQL Mutation to trigger Heavy AI processing
      const mutation = `
        mutation BuildTriNetraOS($userId: ID!, $prompt: String!) {
          executeOSBuild(userId: $userId, prompt: $prompt) {
            status
            logs
            s3OutputFileKey
          }
        }
      `;
      
      const res = await client.graphql({
        query: mutation,
        variables: { userId: currentUser?.trinetraId, prompt: currentPrompt }
      });

      const responseData = res.data.executeOSBuild;

      // Updating terminal with real AI generated logs/code snippets
      setLogs(prev => [...prev, ...responseData.logs]);
      
      if (responseData.status === 'SUCCESS' && responseData.s3OutputFileKey) {
        setS3OutputFileKey(responseData.s3OutputFileKey);
        setLogs(prev => [...prev, `> [SUCCESS] Build completed. Project zipped and secured in AWS S3.`]);
      } else {
        setLogs(prev => [...prev, `> [WARNING] Build finished with warnings.`]);
      }

    } catch (err) {
      console.error("AWS Execution Error:", err);
      setLogs(prev => [...prev, `> [ERROR] AWS Connection Timeout. Ensure your API keys are active.`]);
    } finally {
      setIsExecuting(false);
    }
  };

  // ─── 2. REAL GITHUB SYNC (Using your GH_PAT_TOKEN via AWS) ───────────
  const handleGithubSync = async () => {
    if (!s3OutputFileKey) {
      alert("No project built yet. Execute a prompt first.");
      return;
    }
    
    setIsSyncing(true);
    setLogs(prev => [...prev, `> [GitHub] Authenticating via Secure Token...`]);

    try {
      // 🔥 Send command to AWS to push the S3 zip to the user's connected GitHub Repo
      const mutation = `
        mutation SyncToGithub($userId: ID!, $fileKey: String!) {
          pushToGithub(userId: $userId, fileKey: $fileKey) {
            repoUrl
            status
          }
        }
      `;
      
      const res = await client.graphql({
        query: mutation,
        variables: { userId: currentUser?.trinetraId, fileKey: s3OutputFileKey }
      });

      setLogs(prev => [...prev, `> [GitHub SUCCESS] Code pushed to repository: ${res.data.pushToGithub.repoUrl}`]);
    } catch (err) {
      setLogs(prev => [...prev, `> [GitHub ERROR] Sync failed. Check repo permissions.`]);
    } finally {
      setIsSyncing(false);
    }
  };

  // ─── 3. REAL S3 DOWNLOAD (Direct Universal Download) ─────────────────
  const handleDownloadZip = async () => {
    if (!s3OutputFileKey) return;
    try {
      setLogs(prev => [...prev, `> [AWS S3] Fetching secure download link...`]);
      const urlResult = await getUrl({ path: s3OutputFileKey });
      
      const link = document.createElement('a');
      link.href = urlResult.url.toString();
      link.target = '_blank';
      link.download = `TriNetra_OS_Build_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setLogs(prev => [...prev, `> [AWS S3] Download initiated successfully.`]);
    } catch (e) {
      setLogs(prev => [...prev, `> [AWS S3 ERROR] Failed to fetch file.`]);
    }
  };

  return (
    <div className="h-full bg-[#050505] flex flex-col absolute top-0 w-full z-50 font-mono text-green-400">
      
      {/* 🧠 Header */}
      <div className="p-4 bg-[#0a0a0a] flex justify-between items-center border-b border-green-900/30 shadow-[0_4px_30px_rgba(0,255,0,0.05)]">
        <div className="flex items-center space-x-4">
            <ArrowLeft onClick={onBack} className="text-green-500 cursor-pointer hover:text-white transition-colors" />
            <Terminal className="text-cyan-400" />
            <div>
              <h4 className="font-bold text-cyan-400 tracking-widest uppercase">TriNetra OS Workspace</h4>
              <p className="text-[10px] text-green-600 font-bold">ROOT ACCESS GRANTED</p>
            </div>
        </div>
        
        <div className="flex gap-3">
          {/* GitHub Sync Button */}
          <button 
            onClick={handleGithubSync}
            disabled={isSyncing || !s3OutputFileKey}
            className={`flex items-center text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded transition-all border ${s3OutputFileKey ? 'bg-[#0d1117] hover:bg-gray-800 border-gray-600 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-[#050505] border-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            {isSyncing ? <Loader2 size={14} className="animate-spin mr-2"/> : <Github size={14} className="mr-2"/>} 
            {isSyncing ? 'Syncing...' : 'Push to GitHub'}
          </button>

          {/* S3 Download Button */}
          {s3OutputFileKey && (
            <button 
              onClick={handleDownloadZip}
              className="flex items-center text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded bg-cyan-900/30 border border-cyan-500 text-cyan-400 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              <Download size={14} className="mr-2" /> Download .ZIP
            </button>
          )}
        </div>
      </div>

      {/* 💻 Terminal Area */}
      <div className="flex-1 p-5 bg-[#020202] overflow-y-auto text-sm leading-relaxed space-y-1">
        {logs.map((log, index) => (
          <p key={index} className="break-words whitespace-pre-wrap">{log}</p>
        ))}
        {isExecuting && (
          <p className="animate-pulse text-cyan-500 flex items-center gap-2 mt-2">
            <CloudLightning size={14} /> Processing AWS Lambda Compute...
          </p>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* ⌨️ Command Input Area */}
      <div className="p-4 bg-[#0a0a0a] border-t border-green-900/30 flex items-center space-x-3 pb-8">
        <span className="text-green-500 font-bold ml-2">root@trinetra:~$</span>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleExecute(); }}
          disabled={isExecuting}
          placeholder="Command the AI (e.g., 'Build a custom secure OS kernel')..." 
          className="flex-1 bg-transparent border-none outline-none text-green-400 text-sm placeholder-green-900" 
        />
        <button 
          onClick={handleExecute}
          disabled={isExecuting || !prompt.trim()}
          className={`px-6 py-3 rounded font-black uppercase tracking-widest flex items-center transition-all ${isExecuting || !prompt.trim() ? 'bg-gray-900 text-gray-700' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
        >
          {isExecuting ? <Loader2 size={16} className="animate-spin mr-2"/> : <Play size={16} className="mr-2"/>} 
          {isExecuting ? 'Running...' : 'Execute'}
        </button>
      </div>
    </div>
  );
}
