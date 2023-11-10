import { FormControl, InputLabel, NativeSelect, TextField } from '@mui/material'
import React, { memo } from 'react'

const ProductAdg = ({
  t,
  emptyValidate,
  typeCode,
  setTypeCode,
  newProduct,
  handleChangeInput,
  selectContent,
}) => {

  return (
    <div style={{width:"90%"}}>
      <div style={{fontSize:"80%",marginBottom:"10px"}} >
        <a 
          style={{margin:"0 12px"}}
          href="https://www.petekamutner.am/Content.aspx?itn=tsOSNewCCM#:~:text=%D5%80%D5%80%20%D5%AF%D5%A1%D5%BC%D5%A1%D5%BE%D5%A1%D6%80%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6%2011.11.2014%D5%A9,%D5%AF%D5%B8%D5%A4%D5%A5%D6%80%D5%AB%20%D5%A1%D5%B6%D5%BE%D5%A1%D5%B6%D5%B4%D5%A1%D5%B6%20%D6%81%D5%A1%D5%B6%D5%AF"
          rel="noreferrer"  
          target="_blank"
        >
          {t("productinputs.typeurl1")}
        </a>
      </div>

      <TextField 
        autoComplete="off"
        error={emptyValidate && !typeCode}
        size="small"
        variant="outlined"
        style={{width:"100%", height:"20px"}}
        name="type" 
        value={typeCode}
        label={t("productinputs.typeurl1")}
        onChange={(e)=>{
          setTypeCode()
          setTypeCode(e.target.value)
        }}
      />
    <FormControl>
      <InputLabel  htmlFor="uncontrolled-native">
      </InputLabel>
      <NativeSelect
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
        {selectContent && selectContent.map((item) => (
          <option
            style={{width:"400px"}}
            key={item?.id} 
            value={item?.code}
            title={item?.title}
          >
            {item?.code} | {item?.title?.length > 40 ? `${item?.title.slice(0,39)}...` : item?.title}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  </div> 
  )
}

export default memo(ProductAdg);
