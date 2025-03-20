"use client";

import { SearchForm } from "./SearchForm";

export default function SearchSection() {
    return (
        <section className="flex relative flex-col justify-center px-20 py-16 min-h-[573px] max-md:px-5">
            <img
                src="/Background.svg"
                alt=""
                className="object-cover absolute inset-0 size-full"
            />
            <div className="flex relative flex-col w-full max-md:max-w-full">
                <header className="flex flex-col items-center w-full leading-none text-center text-white max-md:max-w-full">
                    <h1 className="text-4xl font-bold max-md:max-w-full">
                        Trouvez votre train idéal
                    </h1>
                    <p className="mt-5 text-lg max-md:max-w-full">
                        Voyagez en toute simplicité à travers la France
                    </p>
                </header>
                <div className="flex flex-col justify-center self-center p-8 mt-12 max-w-4xl bg-white rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.1)] w-[896px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                    <SearchForm />
                </div>
            </div>
        </section>
    );
}
