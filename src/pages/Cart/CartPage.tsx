import { Link } from 'react-router-dom';
import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import Cart from "../../components/Cart/Cart.tsx";
import Meal from "../../components/Cart/Meal.tsx";


const CartPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Header with navigation */}
      <Header/>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-8">Votre panier</h1>
            
            {/* Outbound journey */}
            <div className="mb-6">
              <div className="mb-2 text-base font-medium text-gray-900">Aller le 20/03/2025</div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                <div className="flex gap-6 items-center">
                  <div>
                    <div className="font-medium text-gray-900">Paris</div>
                    <div className="text-sm text-gray-500">09:30</div>
                  </div>
                  <div className="text-primary">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Lyon</div>
                    <div className="text-sm text-gray-500">11:45</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">45 €</div>
                  <div className="text-sm text-gray-500">2 passagers</div>
                </div>
              </div>
            </div>

            {/* Return journey */}
            <div className="mb-8">
              <div className="mb-2 text-base font-medium text-gray-900">Retour le 27/03/2025</div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                <div className="flex gap-6 items-center">
                  <div>
                    <div className="font-medium text-gray-900">Lyon</div>
                    <div className="text-sm text-gray-500">18:30</div>
                  </div>
                  <div className="text-primary">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Paris</div>
                    <div className="text-sm text-gray-500">20:45</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">45 €</div>
                  <div className="text-sm text-gray-500">2 passagers</div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="mb-8">
              <h2 className="text-base font-medium text-gray-900 mb-4">Options sélectionnées</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Cart />
                    <span className="text-gray-900">Bagage supplémentaire</span>
                  </div>
                  <span className="text-gray-900">+15 €</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Meal />
                    <span className="text-gray-900">Repas à bord</span>
                  </div>
                  <span className="text-gray-900">+10 €</span>
                </div>

              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 pb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total</span>
                <span className="text-gray-900">90 €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Options</span>
                <span className="text-gray-900">25 €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">TVA (20%)</span>
                <span className="text-gray-900">23 €</span>
              </div>
              
              <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">138 €</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Continuer vos achats
              </Link>
              <button className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Payer maintenant
              </button>
            </div>
          </div>
        </div>
      </main>

    <Footer/>

    </div>
  );
};

export default CartPage; 
