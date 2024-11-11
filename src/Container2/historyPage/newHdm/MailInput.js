import { Box, InputAdornment, TextField } from "@mui/material"
import { memo } from "react";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const MailInput = ({func, name, value, t, placeholder, subPlaceholder}) => {

  return(
    <Box >
      <AlternateEmailIcon fontSize="large" sx={{ color: 'action.active', m:1}}/>
      <TextField
        type="mail"
        label={t("authorize.email")}
        placeholder={subPlaceholder}
        name={name}
        value={value ? value : ""}
        InputProps={{
            startAdornment: <InputAdornment position="start">{placeholder}</InputAdornment>,
        }}
        onChange={(e)=>func(e)}
        style={{paddingBottom: "15px",fontSize:"78%"}}
        variant="standard"
      />
    </Box>
  )
};

export default memo(MailInput);