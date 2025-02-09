// all react-query useQuery related hooks are here buy making customHooks.
import { QUERY_KEYS } from "constants/query";

import productsApi from "apis/product";
import { existsBy } from "neetocist";
import { Toastr } from "neetoui";
import { prop } from "ramda";
import { useTranslation } from "react-i18next";
import { useQuery, useQueries } from "react-query";
import useCartItemsStore from "stores/useCartItemsStore";

// to fetch multiple products we use
export const useFetchProducts = params =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsApi.fetch(params),
    keepPreviousData: true,
  });

// to fetch a particular product we use this
export const useShowProduct = slug =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, slug],
    queryFn: () => productsApi.show(slug),
  });

export const useFetchCartProducts = slugs => {
  const { t } = useTranslation();
  const { cartItems, setSelectedQuantity } = useCartItemsStore();
  const responses = useQueries(
    slugs.map(slug => ({
      queryKey: [QUERY_KEYS.PRODUCTS, slug],
      queryFn: () => productsApi.show(slug),
      onSuccess: ({ availableQuantity, name }) => {
        if (availableQuantity >= cartItems[slug]) return;

        setSelectedQuantity(slug, availableQuantity);
        if (availableQuantity === 0) {
          Toastr.error(t("product.error.removedFromCart", { name }), {
            autoClose: 2000,
          });
        }
      },
    }))
  );
  const data = responses.map(prop("data")).filter(Boolean);
  const isLoading = existsBy({ isLoading: true }, responses); // to return the loading part of the response also

  return { data, isLoading };
};
