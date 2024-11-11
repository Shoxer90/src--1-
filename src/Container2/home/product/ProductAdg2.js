import React, { memo, useState } from 'react';
import styles from "../index.module.scss";

const ProductAdg2 = ({
  t,
  emptyValidate,
  typeCode,
  setTypeCode,
  newProduct,
  handleChangeInput,
  selectContent,
}) => {

  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [typeString,setTypeString] = useState("");

  return (
    <div style={{width:"90%"}}>
      {/* <div style={{fontSize:"80%",marginBottom:"10px"}} >
        <a 
          style={{margin:"0 12px"}}
          href="https://www.petekamutner.am/Content.aspx?itn=tsOSNewCCM#:~:text=%D5%80%D5%80%20%D5%AF%D5%A1%D5%BC%D5%A1%D5%BE%D5%A1%D6%80%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6%2011.11.2014%D5%A9,%D5%AF%D5%B8%D5%A4%D5%A5%D6%80%D5%AB%20%D5%A1%D5%B6%D5%BE%D5%A1%D5%B6%D5%B4%D5%A1%D5%B6%20%D6%81%D5%A1%D5%B6%D5%AF"
          rel="noreferrer"  
          target="_blank"
        >
          {t("productinputs.typeurl1")}
        </a>
      </div> */}

      {/* <TextField 
        autoComplete="off"
        error={emptyValidate && !typeCode}
        size="small"
        variant="outlined"
        style={{width:"100%", height:"20px"}}
        name="type" 
        value={typeCode}
        label={`${t("productinputs.typeurl1")} *`}
        onChange={(e)=>{
          setTypeCode()
          setTypeCode(e.target.value)
        }}
      />
    <FormControl>
      <InputLabel  htmlFor="uncontrolled-native">
      </InputLabel>
      <NativeSelect
        value={typeCode ? newProduct?.type: ""}
        error={emptyValidate && !newProduct?.type}
        size="small"
        style={{width:"400px"}}
        inputProps={{
          name: 'type',
        }}
        onChange={(e)=> {
          handleChangeInput(e)
          e.target.value && setTypeCode(e.target.value)
        }}
      >
        {selectContent ? selectContent.map((item) => (
          <option
            style={{width:"400px"}}
            key={item?.id} 
            value={item?.code}
            title={item?.title}
          >
            {item?.code} | {item?.title?.length > 40 ? `${item?.title.slice(0,39)}...` : item?.title}
          </option>
        )): []}
      </NativeSelect>

      
    </FormControl> */}

<div>   
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
          </li>
        )) }
      </ul> : typeString ?
        <p   title={typeString?.title} style={{fontSize:"80%",margin:"0px",padding:"2px",height:"20px"}}>
          {typeString?.code} {typeString?.title?.length > 40 ? `|  ${typeString?.title.slice(0,39)}...` : `| ${typeString?.title}`}
        </p>: null}
    </div>
    </div>

    
  </div> 
  )
}

export default memo(ProductAdg2);
