import { PageLoader } from "components/common";
import Header from "components/common/Header";
import { MRP, OFFER_PRICE } from "components/constants";
import { cartTotalOf } from "components/utils";
import { useFetchCartProducts } from "hooks/reactQuery/useProductsApi";
import i18n from "i18next";
import { NoData } from "neetoui";
import { isEmpty, keys } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";
import withTitle from "utils/withTitle";

import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";

const Cart = () => {
  const { cartItems } = useCartItemsStore.pick();
  const slugs = keys(cartItems);

  // const [isLoading,setIsLoading]=useState(true);
  // const [products,setProducts]=useState([]);
  // const fetchProducts=async()=>{
  //     try{
  //         const responses=await Promise.all(slugs.map(slug => productsApi.show(slug)));
  //         setProducts(responses);

  //         // below is the code to check the availability of the item shown in the cart.If quantity is less we will update
  //         // the cart automatically or we will show the error using toastr
  //             responses.forEach(({ availableQuantity, name, slug }) => {
  //                 if (availableQuantity >= cartItems[slug]) return;

  //                 setSelectedQuantity(slug, availableQuantity);
  //                 if (availableQuantity === 0) {
  //                 Toastr.error(
  //                     `${name} is no longer available and has been removed from cart`,
  //                     {
  //                     autoClose: 2000,
  //                     })
  //                 }})
  //     }catch(err)
  //     {
  //         console.log(err);
  //     }finally{
  //         setIsLoading(false);
  //     }
  // }

  // useEffect(()=>{
  //     fetchProducts();
  // },[cartItems])

  const { data: products = [], isLoading } = useFetchCartProducts(slugs);
  // the whole code above is now put into one line.Power of react-query.
  // Focus on the structuring of the files.

  // This is to send the information to the billing component
  const totalMrp = cartTotalOf(products, MRP);
  const totalOfferPrice = cartTotalOf(products, OFFER_PRICE);

  if (isLoading) return <PageLoader />;

  if (isEmpty(products)) {
    return (
      <>
        <Header title="My Cart" />
        <div className="flex h-screen items-center justify-center">
          <NoData title="Your cart is empty!" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="My Cart" />
      <div className="mt-10 flex justify-center space-x-10">
        <div className="w-1/3 space-y-5">
          {products.map(product => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
        {totalMrp > 0 && (
          <div className="w-1/4">
            <PriceCard {...{ totalMrp, totalOfferPrice }} />
          </div>
        )}
      </div>
    </>
  );
};

export default withTitle(Cart, i18n.t("cart.title"));
