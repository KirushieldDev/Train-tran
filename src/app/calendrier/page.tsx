"use client";

import React, { Suspense } from "react";
import CalendarPage from "./CalendarPage.client";

export default function Page() {
    return (
        <Suspense fallback={<div>Chargement du calendrier…</div>}>
            <CalendarPage />
        </Suspense>
    );
}