import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from "../index.module.scss";

const ProductAdg2 = ({
  typeCode,
  setTypeCode,
  newProduct,
  handleChangeInput,
  selectContent,
}) => {
  const {t} = useTranslation();
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [typeString,setTypeString] = useState("");

  return (
    <div style={{width:"90%"}}>
      <div style={{position:"relative",margin:"10px 0px 0px 0px"}}>
        <input 
          style={{width:"100%",padding:"2px 5px", border:!newProduct?.type && typeCode ? "solid red 2px": null}}
          type="text"
          placeholder={`${t("productinputs.typeurl1")} *`}
          value={typeCode}
          onChange={(e)=>{
            setTypeString("")
            setIsOpenDrop(true)
            setTypeCode()
            setTypeCode(e.target.value)
          }}
        />
       {selectContent?.length && typeCode && isOpenDrop ?
          <ul
            className={styles.styleUl}
            style={{overflowY:selectContent.length> 7 ? "scroll": null}}>
            {selectContent.length && selectContent?.map(item => (
            <li 
              key={item?.id}
              title={item?.title}
              className={styles.liStyle}
              onClick={(e)=> {
                  setIsOpenDrop(false)
                  handleChangeInput(e)
                  setTypeCode(item?.code)
                  setTypeString(item)
                }}
            >
              {item && `${item?.code} | ${item?.title?.length > 40 ? `${item?.title.slice(0,39)}...` : item?.title}`}
            </li>))}
          </ul> : typeString ?
          <p title={typeString?.title} style={{fontSize:"80%",margin:"0px",padding:"2px",height:"20px"}}>
            {typeString?.code} {typeString?.title?.length > 40 ? `|  ${typeString?.title.slice(0,39)}...` : `| ${typeString?.title}`}
          </p>: null}
      </div>
    </div> 
  )
}

export default memo(ProductAdg2);
