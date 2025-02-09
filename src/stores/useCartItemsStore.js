import { isNotEmpty } from "neetocist";
import { assoc, dissoc, evolve } from "ramda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// create takes a callback function where we should return the values inside our store.
// In our case we will return an object.
const useCartItemsStore = create(
  // persist middleware is used to set the items in the localstorage
  // we are storing it in localstorage so that we can get the items added back to us
  persist(
    set => ({
      // cartItems store the key as slug and quantity as value
      cartItems: {},

      // for negative quantities we remove the item from the cartItems else we put it in the slug or update it
      setSelectedQuantity: (slug, quantity) =>
        set(({ cartItems }) => {
          if (quantity <= 0 && isNotEmpty(quantity)) {
            return { cartItems: dissoc(slug, cartItems) };
          }

          return { cartItems: assoc(slug, String(quantity), cartItems) };
        }),

      // this function removes the item fromn the cart
      removeCartItem: slug => set(evolve({ cartItems: dissoc(slug) })),

      // This fucntion is used to clear the cart
      clearCart: () => set({ cartItems: {} }),
    }),
    { name: "cart-items-store" }
  )
);

export default useCartItemsStore;
