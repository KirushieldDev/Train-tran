import Header from "../../components/Header/Header.tsx";
import Features from "../../components/Home/Features/Features.tsx";
import SearchSection from "../../components/Home/Form/SearchSection.tsx";
import Footer from "../../components/Footer/Footer.tsx";


function Home() {
    return (
        <>
            <Header/>
            <SearchSection/>
            <Features/>
            <Footer/>
        </>

    )
}

export default Home