import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Option, OrderSummaryProps } from '../../components/AdditionalOptions/types';
import React from 'react';

// Lock and Shield SVG icons
const LockIcon = () => (
  <svg 
    className="w-4 h-4 mr-1.5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
    />
  </svg>
);

const ShieldIcon = () => (
  <svg 
    className="w-5 h-5 mr-2 text-[#059669]" 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v1.5a5.25 5.25 0 0010.5 0v-1.5A5.25 5.25 0 0012 1.5zM9.75 6.75v-1.5a2.25 2.25 0 114.5 0v1.5a2.25 2.25 0 11-4.5 0z" 
    />
    <path 
      d="M3.75 15.75a3 3 0 013-3h10.5a3 3 0 013 3V18a3 3 0 01-3 3H6.75a3 3 0 01-3-3v-2.25z" 
    />
  </svg>
);

// Create a customized version of OrderSummary for the payment page
const PaymentOrderSummary: React.FC<OrderSummaryProps> = (props) => {
  const { onContinue, ...rest } = props;
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-800">Billet de base</span>
              <span>{rest.basePrice}€</span>
            </div>
            {rest.selectedOptions.map(option => (
              <div key={option.id} className="flex justify-between">
                <span className="text-gray-600 text-sm">Bagage supplémentaire</span>
                <span className="text-[#059669]">{option.price === 0 ? 'Gratuit' : `${option.price}€`}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>{rest.totalPrice}€</span>
            </div>
          </div>
        </div>
        
        {/* SSL Security message - inside the box */}
        <div className="bg-gray-50 py-3 px-6 flex items-center mt-0 border-t border-gray-200">
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 mr-2 text-[#059669]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <span className="text-[#059669] text-sm">Paiement sécurisé par cryptage SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  // Mock data for the order summary
  const basePrice = 45;
  const baggage: Option = {
    id: 'baggage',
    name: 'Bagage supplémentaire',
    description: 'Un bagage supplémentaire de 20kg max',
    price: 15,
    Icon: () => null // We don't need the icon here
  };
  
  const selectedOptions = [baggage];
  const totalPrice = basePrice + baggage.price;
  
  const handleContinue = () => {
    // This would be the payment processing logic
    console.log('Processing payment...');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Reusing Header component */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Payment Form Section */}
          <div className="md:col-span-7 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Paiement sécurisé</h1>
            <p className="text-sm text-gray-600 mb-5">Veuillez saisir vos informations de paiement</p>
            
            <form>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 0012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-[#059669] text-white rounded-md py-3.5 text-sm font-medium"
              >
                <LockIcon />
                Payer maintenant
              </button>
            </form>
          </div>

          {/* Order Summary Section - Using the customized component */}
          <div className="md:col-span-5">
            <div className="flex justify-center md:justify-start">
              <PaymentOrderSummary 
                basePrice={basePrice}
                selectedOptions={selectedOptions}
                totalPrice={totalPrice}
                onContinue={handleContinue}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Reusing Footer component */}
      <Footer />
    </div>
  );
};

export default PaymentPage; 
