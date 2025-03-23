import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Option } from '../../components/AdditionalOptions/types';
import { OrderSummary } from '../../components/AdditionalOptions/OrderSummary';
import CreditCardIcon from '../../assets/Payment/CreditCardIcon';
import HelpIcon from '../../assets/Payment/HelpIcon';
import LockIcon from '../../assets/Payment/LockIcon';
import ShieldIcon from '../../assets/Payment/ShieldIcon';

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

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            {/* Reusing Header component */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Payment Form Section */}
                    <div className="md:col-span-7 bg-white p-6 rounded-lg shadow-sm">
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">Paiement sécurisé</h1>
                        <p className="text-sm text-gray-600 mb-5">Veuillez saisir vos informations de paiement</p>

                        <form>
                            <div className="mb-4">
                                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 mb-1">
                                    Numéro de carte
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        pattern="[0-9\s]{13,19}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <CreditCardIcon />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 mb-1">
                                        Date d'expiration
                                    </label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="cvv"
                                            placeholder="123"
                                            maxLength={3}
                                            pattern="[0-9]{3}"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <HelpIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="cardName" className="text-sm font-medium text-gray-700 mb-1">
                                    Nom sur la carte
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
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

                    {/* Order Summary Section - Using the standard OrderSummary component */}
                    <div className="md:col-span-5">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-96">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <OrderSummary
                                        basePrice={basePrice}
                                        selectedOptions={selectedOptions}
                                        totalPrice={totalPrice}
                                        showButton={false}
                                    />

                                    {/* SSL Security message */}
                                    <div className="mt-4 pt-4 flex items-center justify-center border-t border-gray-200">
                                        <ShieldIcon />
                                        <span className="text-[#059669] text-sm">Paiement sécurisé par cryptage SSL</span>
                                    </div>
                                </div>
                            </div>
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
