import BookingSummary from "@traintran/components/Cart/BookingSummary";
import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <BookingSummary />
            <Footer />
        </div>
    );
}
