import SearchSection from "@traintran/components/Home/Form/SearchSection";
import Header from "@traintran/components/Header/Header";
import Features from "@traintran/components/Home/Features/Features";
import Footer from "@traintran/components/Footer/Footer";

// Page d'accueil, assemblage des sections principales
export default function Home() {
    return (
        <>
            <Header />
            <SearchSection />
            <Features />
            <Footer />
        </>
    );
}
