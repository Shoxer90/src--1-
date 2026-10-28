import { useState } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExcelBurger from "../../Container2/home/excelLoader/buttonForAdd";
import AddNewProduct from "../../Container2/home/product/AddNewProduct";
import SnackErr from "../../Container2/dialogs/SnackErr";
import { getAdg } from "../../services/products/productsRequests";

const emptyProduct = {
  purchasePrice: "",
  price: "",
  type: "",
  brand: "",
  name: "",
  discount: "",
  remainder: "",
  barCode: "",
  innerCode: "",
  photo: "",
  measure: "",
  pan: 0,
  dep: 0,
  categoryIds: [],
};

export default function CreateProducts({ measure, onCreated }) {
  const { t } = useTranslation();
  const [openNewProd, setOpenNewProduct] = useState(false);
  const [newProduct, setProduct] = useState(emptyProduct);
  const [typeCode, setTypeCode] = useState();
  const [selectContent, setSelectContent] = useState();
  const [from, setFrom] = useState("main");
  const [, setFetching] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [type, setType] = useState();

  const changeStatus = () => {
    setProduct(emptyProduct);
    onCreated?.();
  };

  const getSelectData = () => {
    getAdg(typeCode).then((res) => {
      if (res?.length > 1) {
        setSelectContent(res);
        res.forEach((item) => {
          if (item?.code === typeCode) {
            setProduct({ ...newProduct, type: item?.code });
          }
        });
      } else if (res?.length === 1) {
        setSelectContent(res);
        setProduct({ ...newProduct, type: res[0].code });
      } else {
        setProduct({ ...newProduct, type: "" });
        setSelectContent([]);
      }
    });
  };

  return (
    <>
      <ExcelBurger t={t} setOpenNewProduct={setOpenNewProduct} />
      {openNewProd && (
        <AddNewProduct
          newProduct={newProduct}
          setProduct={setProduct}
          setOpenNewProduct={setOpenNewProduct}
          openNewProd={openNewProd}
          changeStatus={changeStatus}
          measure={measure}
          getSelectData={getSelectData}
          typeCode={typeCode}
          setTypeCode={setTypeCode}
          selectContent={selectContent}
          setFetching={setFetching}
          setGlobalMessage={setSnackMessage}
          setGlobalType={setType}
          setFrom={setFrom}
          from={from}
        />
      )}
      <Dialog open={Boolean(type)}>
        <SnackErr open={snackMessage} type={type} close={() => setType()} message={snackMessage} />
      </Dialog>
    </>
  );
}
