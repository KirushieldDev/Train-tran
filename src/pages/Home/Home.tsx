import Header from "../../components/Header/Header.tsx";
import Features from "../../components/Home/Features.tsx";
import SearchSection from "../../components/Home/Form/SearchSection.tsx";


function Home() {
    return (
        <>
            <Header/>
            <SearchSection/>
            <Features/>
        </>

    )
}

export default Home