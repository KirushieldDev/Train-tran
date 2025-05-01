import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import {AdditionalOptions} from "./pages/AdditionalOptions/AdditionalOptions";
import CartPage from "./pages/Cart/CartPage";
import PersonalInfoForm from "./components/Forms/PersonalInfo/PersonalInfoForm.tsx";
import ConfirmationPage from "./pages/Confirmation/ConfirmationPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import Calendar from "./pages/Calendar/CalendarPage.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/form-info" element={<PersonalInfoForm />}></Route>
                <Route path="/options" element={<AdditionalOptions />} />
                <Route path="/paiement" element={<PaymentPage />} />
                <Route path="/calendrier" element={<Calendar />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
