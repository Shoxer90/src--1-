import React, { memo } from "react";
import ReverseItem from "../ReverseItem";
import styles from "../index.module.scss";

const ReverseContent = ({
  t,
  products,
  setReverseContainer,
  reverseContainer,
  checkedProduct,
  setReverseTotal,
  saleInfo,
  selectAllProducts
}) => {

  return(
    <div>
      <div>
        <label className={styles.radioDialog}>
          <span style={{display:"flex",alignItems:"center"}}>
            <input 
              type="checkbox"
              onChange={(e)=>selectAllProducts(e.target.checked)}
            />
            <span style={{marginLeft:"15px"}}>
              {t("history.selectAll")}
            </span>
          </span>
        </label>
      </div>
      {products.map((product,index) => (
        <ReverseItem 
          key={product?.id} 
          product={product} 
          checkedProduct={checkedProduct} 
          index={index} 
          products={products}
          setReverseContainer={setReverseContainer}
          reverseContainer={reverseContainer}
          setReverseTotal={setReverseTotal}
          saleInfo={saleInfo}
        />
      ))}

    </div>
  )
};

export default memo(ReverseContent);
