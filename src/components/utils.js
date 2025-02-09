// here we will create the utility functions to find sum of all mrp and offerPrice
// so we will use the zustand api getState and setState which helps to access outside the components and hooks
// since zustand
import { sum } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";

export const cartTotalOf = (products, priceKey) => {
  const { cartItems } = useCartItemsStore.getState();

  return sum(
    products.map(product => product[priceKey] * cartItems[product.slug])
  );
};
