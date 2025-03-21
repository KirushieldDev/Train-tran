import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CartPage from "./pages/Cart/CartPage";
import PersonalInfoForm from "./components/Forms/PersonalInfo/PersonalInfoForm.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/form-info" element={<PersonalInfoForm />}></Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
