import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import BookingSummary from "../../components/Cart/BookingSummary.tsx";

const CartPage = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <BookingSummary />
            <Footer />
        </div>
    );
};

export default CartPage;
