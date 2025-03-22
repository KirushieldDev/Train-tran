import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { AdditionalOptions } from "./pages/AdditionalOptions/AdditionalOptions";
import CartPage from "./pages/Cart/CartPage";
import PersonalInfoForm from "./components/Forms/PersonalInfo/PersonalInfoForm.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/form-info" element={<PersonalInfoForm />}></Route>
                <Route path="/additional-options" element={<AdditionalOptions />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
