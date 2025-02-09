import { useEffect } from "react";

import { PageLoader, Header, PageNotFound } from "components/common";
import AddToCart from "components/common/AddToCart";
import i18n from "components/commons/i18n";
import useSelectedQuantity from "components/hooks/useSelectedQuantity";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Typography, Button } from "neetoui";
import { isNotNil } from "ramda";
import { useParams } from "react-router-dom";
import routes from "routes";
import withTitle from "utils/withTitle";

import Carousel from "./Carousel";

import productsApi from "../../apis/product";

const Product = () => {
  const { slug } = useParams();
  const { data: product = {}, isLoading, isError } = useShowProduct(slug);

  //This is the custom hook created by us
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
  // useHistory hook is a part of the react-router-dom which gives access to browsing history
  const getProducts = async () => {
    try {
      const imagesFromApi = await productsApi.show(slug);
      console.log(imagesFromApi);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const { name, description, mrp, offerPrice, imageUrls, imageUrl } = product; // always convert the snake_case to camelCase
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed;
  //logic for setting the loader

  if (isLoading) return <PageLoader />;

  if (isError) return <PageNotFound />;

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center">
        <Header title={name} />
      </div>
      <div className="mt-6 flex gap-4">
        <div className="w-2/5">
          {isNotNil(imageUrls) ? (
            <Carousel />
          ) : (
            <img alt={name} className="w-48" src={imageUrl} />
          )}
        </div>
        <div className="w-3/5 space-y-4">
          <Typography>{description}</Typography>
          <Typography>MRP: ${mrp}</Typography>
          <Typography className="font-semibold">
            Offer price: ${offerPrice}
          </Typography>
          <Typography className="font-semibold text-green-600">
            {discountPercentage}% off
          </Typography>
          <div className="flex space-x-10">
            <AddToCart {...{ slug }} />
            <Button
              className="bg-neutral-800 hover:bg-neutral-950"
              label="Buy now"
              size="large"
              to={routes.checkout}
              onClick={() => setSelectedQuantity(selectedQuantity || 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default withTitle(Product, i18n.t("product.title"));
