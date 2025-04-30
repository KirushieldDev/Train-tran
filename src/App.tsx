import AppRoutes from "./route";
import {CartProvider} from "./context/CartContext.tsx";

function App() {
    return (
        <CartProvider>
            <AppRoutes />
        </CartProvider>
    );
}

export default App;
