import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {OptionID} from "@traintran/lib/options";
import {useCart} from "@traintran/context/CartContext";

/**
 * Hook pour :
 * - rediriger vers "/" si le ticket n'existe pas après hydratation
 * - synchroniser un state local selectedOptions avec cartTicket.outbound.options
 */
export function useOptionsSync() {
    const {cartTicket, loadingCart} = useCart();
    const router = useRouter();
    // Liste des OptionID actuellement sélectionnées pour le segment aller
    const [selectedOptions, setSelectedOptions] = useState<OptionID[]>([]);

    // Redirige **seulement** si on a fini de charger et qu'il n'y a pas de ticket
    useEffect(() => {
        if (!loadingCart && !cartTicket) {
            router.push("/");
        }
    }, [loadingCart, cartTicket, router]);

    // sync des options quand cartTicket arrive
    useEffect(() => {
        if (cartTicket) {
            setSelectedOptions(Array.from(cartTicket.options));
        }
    }, [cartTicket]);

    return {selectedOptions, setSelectedOptions};
}
