import React, { useState, useRef } from 'react';
import { Paperclip, X, Image, FileText, Film, Send } from 'lucide-react';

/**
 * ChatAttachment Component
 * यह घटक मैसेज के साथ फाइल, इमेज या वीडियो अटैच करने और सेंड करने की सुविधा देता है।
 */
const ChatAttachment = () => {
    // States
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [message, setMessage] = useState(''); // नया: मैसेज स्टोर करने के लिए
    
    const fileInputRef = useRef(null);

    // फाइल चुनने पर हैंडलर
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSelectedFiles((prev) => [...prev, ...files]);

        // प्रीव्यू जनरेट करना (खासकर इमेज के लिए)
        const newPreviews = files.map((file) => {
            if (file.type.startsWith('image/')) {
                return {
                    url: URL.createObjectURL(file),
                    type: 'image',
                    name: file.name
                };
            }
            return {
                url: null,
                type: 'file',
                name: file.name
            };
        });

        setPreviewUrls((prev) => [...prev, ...newPreviews]);
        
        // फाइल चुनने के बाद इनपुट को रिसेट करें ताकि वही फाइल दोबारा चुनी जा सके
        e.target.value = null; 
    };

    // अटैचमेंट हटाने के लिए
    const removeFile = (index) => {
        const updatedFiles = [...selectedFiles];
        const updatedPreviews = [...previewUrls];

        // मेमोरी लीक से बचने के लिए URL रिवोक करें
        if (updatedPreviews[index].url) {
            URL.revokeObjectURL(updatedPreviews[index].url);
        }

        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // नया: सेंड बटन दबाने पर क्या होगा
    const handleSendMessage = () => {
        if (message.trim() === '' && selectedFiles.length === 0) {
            // अगर मैसेज भी खाली है और कोई फाइल भी नहीं है, तो कुछ मत करो
            return;
        }

        // यहाँ आप अपना असली API कॉल या बैकएंड लॉजिक लगा सकते हैं
        console.log("Sending Message:", message);
        console.log("Sending Files:", selectedFiles);

        // सेंड होने के बाद सब कुछ क्लियर कर दें
        setMessage('');
        
        // पुराने URLs को मेमोरी से हटाएँ
        previewUrls.forEach(preview => {
            if (preview.url) URL.revokeObjectURL(preview.url);
        });
        
        setSelectedFiles([]);
        setPreviewUrls([]);
    };

    // एंटर दबाने पर भी मैसेज सेंड हो
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* प्रीव्यू सेक्शन */}
            {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    {previewUrls.map((file, index) => (
                        <div key={index} className="relative group w-24 h-24 border rounded-md overflow-hidden bg-white">
                            {file.type === 'image' ? (
                                <img 
                                    src={file.url} 
                                    alt="preview" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-1">
                                    <FileText className="text-blue-500 w-8 h-8" />
                                    <span className="text-[10px] truncate w-full text-center mt-1">
                                        {file.name}
                                    </span>
                                </div>
                            )}
                            
                            {/* डिलीट बटन */}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* इनपुट और एक्शन बार */}
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-full">
                <button 
                    onClick={triggerFileInput}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                    title="Attach File"
                >
                    <Paperclip size={20} />
                </button>
                
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*,video/*,application/pdf,.doc,.docx"
                />

                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-2 px-1"
                />

                <button 
                    onClick={handleSendMessage}
                    disabled={message.trim() === '' && selectedFiles.length === 0}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>

            {/* हेल्प टेक्स्ट */}
            <div className="mt-2 flex gap-4 text-[11px] text-gray-400 px-2">
                <span className="flex items-center gap-1"><Image size={12}/> Images</span>
                <span className="flex items-center gap-1"><Film size={12}/> Videos</span>
                <span className="flex items-center gap-1"><FileText size={12}/> Documents</span>
            </div>
        </div>
    );
};

export default ChatAttachment;
