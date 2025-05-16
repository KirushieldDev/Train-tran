import React, { Suspense } from "react";
import Header from "@traintran/components/Header/Header";
import Features from "@traintran/components/Home/Features/Features";
import Footer from "@traintran/components/Footer/Footer";

import SearchSection from "@traintran/components/Home/Form/SearchSection";

export default function Home() {
    return (
        <>
            <Header />

            <Suspense fallback={<div>Loading search…</div>}>
                <SearchSection />
            </Suspense>

            <Features />
            <Footer />
        </>
    );
}