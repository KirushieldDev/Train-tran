import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { AdditionalOptions } from "./pages/AdditionalOptions/AdditionalOptions";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/additional-options" element={<AdditionalOptions />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;