import React, { useState } from 'react';
import { MapPin, MessageCircle, Share2, ArrowLeft, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Hardcoded Data) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function ProductDetails({ product, currentUser, onBack, onMessageSeller }) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('PAYPAL'); // Default Gateway

  // ─── 1. REAL PAYMENT GATEWAY INTEGRATION (Point 6) ──────────────────
  const handlePayment = async () => {
    if (!product || !selectedGateway) return;
    
    setIsProcessing(true);
    try {
      // 🔥 AWS AppSync Mutation: Triggering Secure Payment Engine
      // यह रिक्वेस्ट सीधे आपके AWS Backend (PaymentController) पर जाएगी
      // और वहां से PayU, Braintree, PayPal, Paddle या Adyen का असली सेशन क्रिएट करेगी।
      const mutation = `
        mutation ProcessMarketplaceOrder($buyerId: ID!, $productId: ID!, $gateway: String!, $amount: Float!) {
          createTriNetraOrder(buyerId: $buyerId, productId: $productId, gateway: $gateway, amount: $amount) {
            orderId
            checkoutUrl
            status
          }
        }
      `;

      const res = await client.graphql({
        query: mutation,
        variables: {
          buyerId: currentUser?.trinetraId,
          productId: product.id,
          gateway: selectedGateway,
          amount: parseFloat(product.price)
        }
      });

      const orderData = res.data.createTriNetraOrder;

      if (orderData.status === 'REQUIRES_ACTION' && orderData.checkoutUrl) {
        // Redirect to the real Payment Gateway Checkout Page (PayPal, Paddle, etc.)
        window.location.href = orderData.checkoutUrl;
      } else {
        alert(t("Order initialized securely via AWS."));
      }

    } catch (err) {
      console.error("❌ AWS Payment Error:", err);
      alert(t("Payment gateway connection failed securely."));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) return null;

  return (
    <div className="h-full bg-[#0a1014] text-white flex flex-col absolute top-0 w-full z-50 overflow-y-auto font-sans animate-fade-in">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center fixed w-full top-0 z-40">
        <button onClick={onBack} className="bg-black/50 p-2 rounded-full hover:bg-black transition-colors active:scale-90">
          <ArrowLeft className="text-white" />
        </button>
        <button className="bg-black/50 p-2 rounded-full hover:bg-black transition-colors active:scale-90">
          <Share2 className="text-white" />
        </button>
      </div>

      {/* 🖼️ Real Product Image from AWS S3 */}
      <div className="h-80 bg-black w-full flex items-center justify-center relative">
        <img src={product.mediaUrl} alt={product.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-[#0a1014] to-transparent"></div>
      </div>

      <div className="p-5 -mt-4 relative z-10">
        <h1 className="text-4xl font-black text-green-400 tracking-tighter">₹{product.price}</h1>
        <h2 className="text-xl font-bold mt-1 text-gray-100">{product.title}</h2>
        
        <div className="flex items-center justify-between text-gray-400 text-xs mt-3 border-b border-gray-800 pb-4">
          <span className="flex items-center uppercase tracking-widest font-bold"><MapPin size={14} className="mr-1 text-cyan-400"/> {product.category}</span>
          <span className="uppercase tracking-widest">{new Date(product.timestamp).toLocaleDateString()}</span>
        </div>

        {/* Real Product Description */}
        {product.desc && (
          <div className="mt-4 border-b border-gray-800 pb-4">
            <h3 className="font-bold mb-2 uppercase tracking-widest text-xs text-gray-500">{t("Description")}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{product.desc}</p>
          </div>
        )}

        {/* Real Seller Information */}
        <div className="mt-4">
          <h3 className="font-bold mb-3 uppercase tracking-widest text-xs text-gray-500">{t("Seller Information")}</h3>
          <div className="flex items-center justify-between bg-[#111827] p-3 rounded-2xl border border-gray-800">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-cyan-900 border border-cyan-500 rounded-full flex items-center justify-center font-bold">
                 {product.sellerId?.substring(0,2).toUpperCase()}
               </div>
               <div>
                 <p className="font-bold text-sm">{product.sellerId}</p>
                 <p className="text-[10px] text-green-500 font-bold uppercase flex items-center gap-1">
                   <ShieldCheck size={12}/> Verified TriNetra ID
                 </p>
               </div>
             </div>
             {/* Connects to Messenger (Point 5) */}
             <button 
               onClick={() => onMessageSeller(product.sellerId)}
               className="bg-gray-800 p-2.5 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors active:scale-90"
             >
               <MessageCircle size={20}/>
             </button>
          </div>
        </div>

        {/* 💳 REAL PAYMENT GATEWAYS SELECTION (Point 6) */}
        <div className="mt-6 bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="font-bold mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
            <CreditCard size={16} className="text-cyan-400"/> {t("Select Payment Gateway")}
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['PAYPAL', 'PAYU', 'BRAINTREE', 'PADDLE', 'ADYEN'].map((gateway) => (
              <button 
                key={gateway}
                onClick={() => setSelectedGateway(gateway)}
                className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedGateway === gateway ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'}`}
              >
                {gateway}
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-400 text-black p-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <>{t("Buy Now Securely")} • ₹{product.price}</>}
          </button>
        </div>

      </div>
    </div>
  );
}
