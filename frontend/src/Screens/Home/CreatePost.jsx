import React, { useState, useRef } from 'react';
import { Image as ImageIcon, FileText, Mic, Video, MapPin, Send, Loader2, X, Camera, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Fake Alerts) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function CreatePost({ currentUser, onPostCreated }) {
  const { t } = useTranslation();
  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(''); // 'image', 'video', 'audio', 'pdf'
  const [location, setLocation] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // References for hidden file inputs
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const docRef = useRef(null);
  const cameraRef = useRef(null);

  // ─── 1. REAL MEDIA SELECTION & PREVIEW ────────────────────────────
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setMediaType(type);

    // Create a local preview URL instantly
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
  };

  const removeMedia = () => {
    setSelectedFile(null);
    setMediaPreview(null);
    setMediaType('');
  };

  // ─── 📥 UNIVERSAL DOWNLOAD IN DRAFT (Point 4) ──────────────────────
  const handleLocalDownload = () => {
    if (!mediaPreview || !selectedFile) return;
    const link = document.createElement('a');
    link.href = mediaPreview;
    link.download = `TriNetra_Draft_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── 2. REAL GPS LOCATION FETCH (Browser Native) ──────────────────
  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
      }, () => {
        alert(t("Location access denied."));
      });
    }
  };

  // ─── 3. REAL AWS POST CREATION (S3 + DynamoDB) ────────────────────
  const handlePost = async () => {
    if (!postText.trim() && !selectedFile) return;
    
    setIsPosting(true);
    let finalMediaUrl = null;

    try {
      // Step A: Upload Media to AWS S3
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `posts/${currentUser?.trinetraId}/${Date.now()}_trinetra.${fileExt}`;
        
        await uploadData({
          path: `public/${fileName}`,
          data: selectedFile,
          options: { contentType: selectedFile.type, accessLevel: 'guest' }
        }).result;

        const urlResult = await getUrl({ path: `public/${fileName}` });
        finalMediaUrl = urlResult.url.toString();
      }

      // Step B: Save Post to AWS DynamoDB
      const mutation = `
        mutation CreateFeedPost($userId: ID!, $text: String, $mediaUrl: String, $mediaType: String, $location: String) {
          createTriNetraPost(userId: $userId, text: $text, mediaUrl: $mediaUrl, mediaType: $mediaType, location: $location) {
            id
            timestamp
          }
        }
      `;
      
      await client.graphql({
        query: mutation,
        variables: {
          userId: currentUser?.trinetraId || 'UNKNOWN_ID',
          text: postText,
          mediaUrl: finalMediaUrl,
          mediaType: mediaType,
          location: location
        }
      });

      setPostText('');
      removeMedia();
      setLocation('');
      if (onPostCreated) onPostCreated();

    } catch (err) {
      console.error("❌ AWS Post Creation Failed:", err);
      alert(t("Failed to publish post to secure server."));
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-[#111827] p-4 rounded-2xl shadow-lg border border-gray-800 mb-6 font-sans">
      
      {/* 📝 Text Input Area */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-10 h-10 bg-cyan-900 border border-cyan-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          {currentUser?.trinetraId?.substring(0,2).toUpperCase() || 'TR'}
        </div>
        <div className="flex-1">
          <textarea 
            placeholder={t("What's on your mind? Post Text, Photo, Video, or PDF...")} 
            className="w-full bg-transparent text-white outline-none resize-none h-16 mt-2 placeholder-gray-500 text-sm"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            disabled={isPosting}
          />
          {location && <p className="text-[10px] text-cyan-400 font-bold tracking-widest mt-1 flex items-center"><MapPin size={10} className="mr-1"/> {location}</p>}
        </div>
      </div>

      {/* 🖼️ Real Media Preview Area WITH DOWNLOAD BUTTON */}
      {mediaPreview && (
        <div className="relative mb-4 rounded-xl overflow-hidden border border-gray-700 bg-black group">
          {mediaType === 'image' && <img src={mediaPreview} alt="preview" className="w-full h-auto max-h-64 object-cover" />}
          {mediaType === 'video' && <video src={mediaPreview} controls className="w-full max-h-64" />}
          {mediaType === 'audio' && <audio src={mediaPreview} controls className="w-full mt-4 mb-4" />}
          {mediaType === 'pdf' && (
            <div className="p-6 flex items-center justify-center text-red-400 bg-gray-900 font-bold uppercase tracking-widest">
              <FileText size={30} className="mr-3" /> Document Attached
            </div>
          )}
          
          {/* Action Buttons Container */}
          <div className="absolute top-2 right-2 flex gap-2">
            {/* 🔥 New: Download Draft Media Button */}
            <button onClick={handleLocalDownload} disabled={isPosting} title="Download to Gallery" className="bg-black/80 text-white p-1.5 rounded-full hover:text-cyan-400 transition-colors shadow-lg">
              <Download size={16} />
            </button>
            
            {/* Remove Media Button */}
            <button onClick={removeMedia} disabled={isPosting} title="Remove" className="bg-black/80 text-white p-1.5 rounded-full hover:text-red-500 transition-colors shadow-lg">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* 🎛️ Real Control Panel (Point 4 Multi-Media Upload) */}
      <div className="flex justify-between items-center border-t border-gray-800 pt-3">
        
        {/* Hidden Inputs */}
        <input type="file" accept="image/*" ref={imageRef} className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
        <input type="file" accept="video/*" ref={videoRef} className="hidden" onChange={(e) => handleFileSelect(e, 'video')} />
        <input type="file" accept="audio/*" capture="microphone" ref={audioRef} className="hidden" onChange={(e) => handleFileSelect(e, 'audio')} />
        <input type="file" accept=".pdf,.doc,.txt" ref={docRef} className="hidden" onChange={(e) => handleFileSelect(e, 'pdf')} />
        <input type="file" accept="image/*,video/*" capture="environment" ref={cameraRef} className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />

        <div className="flex space-x-4 text-gray-400">
          <button onClick={() => imageRef.current.click()} disabled={isPosting} title="Photo" className="hover:text-cyan-400 transition-colors active:scale-90"><ImageIcon size={20}/></button>
          <button onClick={() => videoRef.current.click()} disabled={isPosting} title="Video" className="hover:text-violet-400 transition-colors active:scale-90"><Video size={20}/></button>
          <button onClick={() => cameraRef.current.click()} disabled={isPosting} title="Camera" className="hover:text-pink-400 transition-colors active:scale-90"><Camera size={20}/></button>
          {/* Native Mic Capture */}
          <button onClick={() => audioRef.current.click()} disabled={isPosting} title="Voice Note" className="hover:text-green-400 transition-colors active:scale-90"><Mic size={20}/></button>
          <button onClick={() => docRef.current.click()} disabled={isPosting} title="PDF/Doc" className="hover:text-red-400 transition-colors active:scale-90"><FileText size={20}/></button>
          <button onClick={fetchLocation} disabled={isPosting} title="Location" className="hover:text-yellow-400 transition-colors active:scale-90"><MapPin size={20}/></button>
        </div>

        <button 
          onClick={handlePost} 
          disabled={isPosting || (!postText.trim() && !selectedFile)}
          className={`px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center transition-all ${isPosting || (!postText.trim() && !selectedFile) ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95'}`}
        >
          {isPosting ? <Loader2 size={16} className="animate-spin mr-2"/> : t("Post")} 
          {!isPosting && <Send size={14} className="ml-2"/>}
        </button>
      </div>
    </div>
  );
}
