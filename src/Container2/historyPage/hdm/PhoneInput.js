import { Box, InputAdornment, TextField } from "@mui/material"
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import { memo } from "react";

const PhoneInput = ({func, name, value, t, placeholder, subPlaceholder}) => {

  return(
    <Box>
    <MobileScreenShareIcon fontSize="large" sx={{ color: 'action.active', m:1}}/>
    <TextField
      type="number"
      label={t("authorize.phone")}
      placeholder={subPlaceholder}
      name={name}
      value={value ? value : ""}
      InputProps={{
        startAdornment: <InputAdornment position="start">{placeholder}</InputAdornment>,
      }}
      onChange={(e)=>func(e)}
      sx={{ "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "input[type=number]": {
        MozAppearance: "textfield",
      },}}
      style={{paddingBottom: "15px",fontSize:"medium"}}
      variant="standard"
    />
  </Box>
  )
};

export default memo(PhoneInput);
