import { memo, useContext, useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import { useTranslation } from "react-i18next";
import { LimitContext } from "../../../context/Context";
import { toCategoryIconSrc } from "../../../services/categories/categoriesRequests";
import UpdateProduct from "../product/UpdateProduct";
import MarketXBadge from "./MarketXBadge";
import styles from "./index.module.scss";
import homeStyles from "../index.module.scss";

const BarcodeMark = () => (
  <svg width="15" height="13" viewBox="0 0 24 16" fill="currentColor" aria-hidden="true" style={{flexShrink:0}}>
    <rect x="1" y="1" width="1.6" height="14" />
    <rect x="4" y="1" width="1" height="14" />
    <rect x="6.4" y="1" width="2.4" height="14" />
    <rect x="10" y="1" width="1" height="14" />
    <rect x="12.4" y="1" width="1.6" height="14" />
    <rect x="15.4" y="1" width="1" height="14" />
    <rect x="17.8" y="1" width="2.2" height="14" />
    <rect x="21.4" y="1" width="1.6" height="14" />
  </svg>
);

const style = {
  display:"flex",
  justifyContent:"flex-start",
  alignItems:"center",
  padding:"5px",
  height:"135px",
  width:"300px",
  picture:{
    height:"125px",
    width:"110px",
    border:"solid lightgray 2px",
    objectFit: "contain",
  },
  info:{
    margin:"20px 5px",
    fontSize:"80%",
    textAlign:"start",
    fontWeight: 600,
  }
};

const localizedName = (product, language) => {
  const lang = `${language || ""}`.toLowerCase();
  if (lang.startsWith("ru")) return product?.nameRu || product?.name || product?.nameHy || product?.nameEn || "";
  if (lang.startsWith("en")) return product?.nameEn || product?.name || product?.nameHy || product?.nameRu || "";
  return product?.nameHy || product?.name || product?.nameRu || product?.nameEn || "";
};

const MarketXProductCard = ({
  product,
  index,
  measure,
  deleteAndRefresh,
  deleteBasketItem,
  getSelectData,
  typeCode,
  setTypeCode,
  setContent,
  content,
  setCurrentPage,
}) => {
  const { t, i18n } = useTranslation();
  const { limitedUsing } = useContext(LimitContext);
  const [openUpdateProd, setOpenUpdateProduct] = useState(false);
  const [, setNewPrice] = useState(product?.discountedPrice);
  const name = localizedName(product, i18n.language);
  const price = Number(product?.marketXPrice ?? product?.price) || 0;
  const discount = Number(product?.marketXDiscount ?? product?.discount) || 0;
  const discountedPrice = Number(product?.marketXDiscountedPrice ?? product?.discountedPrice);
  const newPrice = Number.isFinite(discountedPrice) ? discountedPrice : price;
  const remainder = product?.remainder;
  const hasRemainder = remainder != null && remainder !== "";
  const photo = toCategoryIconSrc(product?.photo) || "/default-placeholder.png";
  const measureLabel = product?.measure ? t(`units.${product.measure}`, { defaultValue: product.measure }) : "";

  return (
    <Card
      style={{
        border: product?.type?.includes(".") ? "solid #3FB68A 2px" : "solid orange 2px",
        padding:"7px",
        position:"relative"
      }}
    >
      <div style={{display:"flex", justifyContent:"space-between", padding:"2px 5px", alignItems:"center"}}>
        <div
          className={name?.length > 22 ? styles.hovertext : undefined}
          style={{fontSize:"90%", fontWeight:700, alignItems:"center", flex:1, minWidth:0}}
          data-hover={`${name} ${product?.brand || ""}`}
        >
          {name?.length > 25 ? `${name.slice(0,24)}...` : name}{" "}
          {name?.length + (product?.brand?.length || 0) < 25 && product?.brand ? `"${product.brand}"` : ""}
        </div>
        {!limitedUsing && (
          <span className={homeStyles.productContent_item_icons} onClick={(e) => e.stopPropagation()}>
            <ModeIcon
              fontSize="medium"
              sx={{ color: "orange" }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenUpdateProduct(true);
              }}
            />
          </span>
        )}
      </div>
      <Divider style={{margin:1, backgroundColor:"gray", width:"90%", alignSelf:"center"}}/>
      <Box style={style}>
        <Box style={{width:"110px", height:"125px", display:"flex", flexDirection:"column", flexShrink:0, position:"relative"}}>
          <img
            style={{...style.picture, height:"105px"}}
            src={photo}
            alt={name || index}
          />
          <MarketXBadge />
          <div
            className={product?.innerCode?.length > 12 ? styles.hovertext : undefined}
            data-hover={`${product?.innerCode || ""}`}
            style={{fontSize:"80%", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"110px", lineHeight:1.2, textAlign:"center", marginTop:"2px"}}
          >
            {product?.innerCode || "—"}
          </div>
        </Box>
        <Box style={style.info}>
          <div style={{marginTop:"10px"}}>
            {t("updates.price")}: {price} {t("units.amd")}
          </div>
          <div>
            {discount > 0 ? (
              <div style={{color:"red", fontWeight:800}}>
                {t("productcard.newprice")}
                {newPrice % 1 ? newPrice.toFixed(2) : newPrice} {t("units.amd")}
              </div>
            ) : <div style={{height:"18px"}}>{""}</div>}
          </div>
          {hasRemainder && Number(remainder) > 0 ? (
            <>
              <div style={{margin:"1px"}}>
                {t("productcard.remainder")} {Number(remainder) % 1 ? Number(remainder).toFixed(3) : remainder} {measureLabel}
              </div>
              <div style={{height:"18px"}}>{""}</div>
              <div
                className={product?.barCode?.length > 17 ? styles.hovertext : undefined}
                data-hover={`${product?.barCode || ""}`}
                style={{display:"flex", alignItems:"center", gap:"3px"}}
              >
                <BarcodeMark />
                {product?.barCode?.length > 17 ? `${product.barCode.slice(0,17)}...` : product?.barCode}
              </div>
            </>
          ) : (
            <>
              <div style={{display:"flex", alignItems:"center", gap:"3px"}}>
                <BarcodeMark />
                {product?.barCode}
              </div>
              {hasRemainder ? (
                <div style={{marginBottom:"14px", color:"red"}}>{t("productcard.outofstock")}</div>
              ) : <div style={{height:"18px"}}>{""}</div>}
            </>
          )}
        </Box>
      </Box>
      {openUpdateProd && (
        <UpdateProduct
          openUpdateProd={openUpdateProd}
          measure={measure}
          setOpenUpdateProduct={setOpenUpdateProduct}
          product={product}
          deleteAndRefresh={deleteAndRefresh}
          setNewPrice={setNewPrice}
          setContent={setContent}
          content={content}
          getSelectData={getSelectData}
          typeCode={typeCode}
          setTypeCode={setTypeCode}
          setCurrentPage={setCurrentPage}
          deleteBasketItem={deleteBasketItem}
        />
      )}
    </Card>
  );
};

export default memo(MarketXProductCard);
