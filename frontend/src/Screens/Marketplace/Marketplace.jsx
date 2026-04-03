import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Plus, Tag, Loader2, Upload, X, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Fake APIs) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function Marketplace({ currentUser, onProductSelect }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real 'Sell Item' Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', price: '', category: '', desc: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // ─── 1. REAL AWS DYNAMODB FETCH (Live Market) ───────────────────
  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      // Fetch active products from AWS DynamoDB
      const res = await client.graphql({
        query: `query ListMarketplaceItems {
          listTriNetraProducts(limit: 100) { items { id sellerId title price category mediaUrl timestamp } }
        }`
      });
      // Sort newest first
      const sortedItems = res.data.listTriNetraProducts.items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setItems(sortedItems);
    } catch (err) {
      console.error("❌ AWS Marketplace Offline:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. REAL SELLING LOGIC (S3 Upload + AppSync) ──────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedFile || !newItem.title || !newItem.price) return alert(t("Missing product details!"));
    
    setIsUploading(true);
    try {
      // Step A: Secure Photo Upload to AWS S3
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `marketplace/${currentUser?.trinetraId}/${Date.now()}_product.${fileExt}`;
      
      await uploadData({
        path: `public/${fileName}`,
        data: selectedFile,
        options: { contentType: selectedFile.type, accessLevel: 'guest' }
      }).result;

      const urlResult = await getUrl({ path: `public/${fileName}` });
      const finalMediaUrl = urlResult.url.toString();

      // Step B: Save Product to AWS DynamoDB
      await client.graphql({
        query: `mutation CreateProduct($sellerId: ID!, $title: String!, $price: Float!, $category: String!, $desc: String, $mediaUrl: String!) {
          createTriNetraProduct(sellerId: $sellerId, title: $title, price: $price, category: $category, desc: $desc, mediaUrl: $mediaUrl) { id }
        }`,
        variables: {
          sellerId: currentUser?.trinetraId,
          title: newItem.title,
          price: parseFloat(newItem.price),
          category: newItem.category,
          desc: newItem.desc,
          mediaUrl: finalMediaUrl
        }
      });

      // Close modal, reset, and refresh market
      setShowAddModal(false);
      setNewItem({ title: '', price: '', category: '', desc: '' });
      setSelectedFile(null);
      fetchMarketplaceItems();
      alert(t("Product is now LIVE in the market!"));

    } catch (err) {
      console.error("❌ AWS Product Listing Failed:", err);
      alert(t("Failed to list product securely."));
    } finally {
      setIsUploading(false);
    }
  };

  // Filter items by search
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-20 font-sans relative">
      
      {/* 🚀 Header & Search */}
      <div className="p-4 bg-[#111827] sticky top-0 z-40 border-b border-gray-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white flex items-center gap-2">
            <ShoppingBag size={24} className="text-cyan-400" /> {t("Marketplace")}
          </h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center gap-1 font-bold text-xs uppercase tracking-widest"
          >
            <Plus size={18}/> <span className="hidden sm:inline">{t("Sell")}</span>
          </button>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-500" />
          <input 
            type="text" 
            placeholder={t("Search Marketplace...")}
            className="w-full bg-[#0a1014] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 🛍️ Real Products Grid */}
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center mt-20"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => onProductSelect(item)} // Connects to ProductDetails.jsx
              className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-lg group cursor-pointer hover:border-cyan-500/50 transition-all animate-fade-in-up"
            >
              <div className="h-40 bg-black relative overflow-hidden">
                <img src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="product" />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-green-400 border border-green-500/30 shadow-lg">
                  ₹{item.price}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-xs truncate group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[9px] text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                    <Tag size={10}/> {item.category}
                  </p>
                  <p className="text-[8px] text-gray-600 font-bold tracking-widest">{item.sellerId.substring(0,8)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ➕ REAL 'SELL ITEM' UPLOAD MODAL (S3 + DynamoDB) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 animate-fade-in">
          <form onSubmit={handleAddProduct} className="bg-[#111827] w-full max-w-md p-6 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative">
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 active:scale-90"><X size={24}/></button>
            
            <h2 className="text-xl font-black uppercase tracking-widest text-cyan-400 mb-6 flex items-center gap-2">
              <ShoppingBag size={20}/> {t("List a Product")}
            </h2>

            {/* S3 Image Uploader */}
            <div 
              className="w-full h-32 bg-[#0a1014] border-2 border-dashed border-gray-700 hover:border-cyan-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer mb-4 transition-colors relative overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {selectedFile ? (
                <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover opacity-60" alt="preview" />
              ) : (
                <>
                  <Upload className="text-cyan-500 mb-2" size={24} />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t("Tap to upload photo")}</span>
                </>
              )}
              {selectedFile && <CheckCircle className="absolute text-green-500 z-10" size={32} />}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            {/* Real Inputs */}
            <div className="space-y-3">
              <input type="text" placeholder={t("Product Title")} required className="w-full bg-[#0a1014] border border-gray-800 p-3 rounded-xl text-sm focus:border-cyan-500 outline-none" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
              
              <div className="flex gap-3">
                <input type="number" placeholder={t("Price (₹)")} required className="w-1/2 bg-[#0a1014] border border-gray-800 p-3 rounded-xl text-sm focus:border-green-500 outline-none text-green-400 font-bold" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                <select className="w-1/2 bg-[#0a1014] border border-gray-800 p-3 rounded-xl text-sm focus:border-cyan-500 outline-none text-gray-300" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                  <option value="">{t("Category")}</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Property">Property</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <textarea placeholder={t("Description")} rows="3" className="w-full bg-[#0a1014] border border-gray-800 p-3 rounded-xl text-sm focus:border-cyan-500 outline-none resize-none" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
            </div>

            <button type="submit" disabled={isUploading} className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : t("Post to Market")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
