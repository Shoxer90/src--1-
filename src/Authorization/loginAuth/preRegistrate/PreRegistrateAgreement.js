import React, { memo } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const PreRegistrateAgreement = ({title, agree, setAgree}) => {

  return (
    <div style={{textAlign:"start",paddingBottom:'5px'}}>
      <FormControlLabel
        checked={agree}
        control={<Checkbox sx={{m:0,p:0,ml:2}}  color="success" />}
        label={title}
        labelPlacement="end"
        onChange={()=>setAgree(!agree)}
      />
    </div>
  )
};

export default memo(PreRegistrateAgreement);
