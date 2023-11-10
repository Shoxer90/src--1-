import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { memo } from 'react';

const PayDocument = ({title, t}) => {
  const [serviceType, setServiceType] = useState(title);

  return (
    title && <RadioGroup 
      row
      value={title}
      onChange={(e) => setServiceType(e.target.value)}
      sx={{ '& .MuiFormControlLabel-label': { fontSize: '78%' } }}
    >
      <FormControlLabel value={"Hdm"} control={<Radio />} label={t("cardService.ehdm")} />
      {/* <FormControlLabel value="tax" control={<Radio />} label={t("cardService.tax")} /> */}
    </RadioGroup>
  )
}

export default memo(PayDocument);
