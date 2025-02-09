import { useRef } from "react";

import { TooltipWrapper } from "components/common";
import { VALID_COUNT_REGEX } from "components/constants";
import useSelectedQuantity from "components/hooks/useSelectedQuantity";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { Button, Toastr, Input } from "neetoui";

const ProductQuantity = ({ slug }) => {
  // we need to put the focus outside the input if the quantity entered is outside the limit
  const countInputFocus = useRef(null);
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
  const { data: product = {} } = useShowProduct(slug);
  const { availableQuantity } = product;

  const parsedQuantity = parseInt(selectedQuantity) || 0;
  const isNotValidQuantity = parsedQuantity >= availableQuantity;
  const preventNavigation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetCount = event => {
    const { value } = event.target;
    const isNotValidInputQuantity = parseInt(value) > availableQuantity;

    if (isNotValidInputQuantity) {
      Toastr.error(`Only ${availableQuantity} units are available`, {
        autoClose: 2000,
      });
      setSelectedQuantity(availableQuantity);
      countInputFocus.current.blur(); // here we put the focus out from the input
    } else if (VALID_COUNT_REGEX.test(value)) {
      setSelectedQuantity(value);
    }
  };

  return (
    <div className="neeto-ui-border-black neeto-ui-rounded inline-flex flex-row items-center border">
      <Button
        className="focus-within:ring-0"
        label="-"
        style="text"
        onClick={e => {
          setSelectedQuantity(parsedQuantity - 1);
          preventNavigation(e);
        }}
      />
      {/* Here input components show the quantity of items selected */}
      <Input
        nakedInput
        className="ml-2"
        contentSize="2"
        ref={countInputFocus}
        value={selectedQuantity}
        onChange={handleSetCount}
        onClick={preventNavigation}
      />
      <TooltipWrapper
        content="Reached maximum units"
        position="top"
        showTooltip={isNotValidQuantity}
      >
        <Button
          className="focus-within:ring-0"
          disabled={isNotValidQuantity}
          label="+"
          style="text"
          onClick={e => {
            setSelectedQuantity(parsedQuantity + 1);
            preventNavigation(e);
          }}
        />
      </TooltipWrapper>
    </div>
  );
};

export default ProductQuantity;
