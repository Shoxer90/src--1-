import { memo } from "react";

const StoresItem = ({
  store,
  director,
  index
}) => {
  return(
    <div>
      {index}.
      {store?.legalName}

    </div>
  )
};

export default memo(StoresItem);
