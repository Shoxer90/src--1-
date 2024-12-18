import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { memo } from "react";

const PayStatusSelect = ({
  t,
  status,
  initDate,
  getHistoryByStartAndEndDates}) => {

  return(
    <FormControl  sx={{ m: 1, width: 170 }} >
      <InputLabel>{t("settings.status")}</InputLabel>
      <Select       
        value={status}
        label={t("settings.status")}
        onChange={(e) => getHistoryByStartAndEndDates(e.target.value, 1, initDate)}
      >
        <MenuItem value="Paid"> {t("history.paid")} </MenuItem>
        <MenuItem value="Prepayment"> {t("history.prepaymentRedemption2")} </MenuItem>
        <MenuItem value="Canceled"> {t("history.canceled")} </MenuItem>
        <MenuItem value="Unpaid"> {t("history.no_paid")} </MenuItem>
        {/* <MenuItem value="EndPrepayment"> {t("history.prepaymentRedemption3")} </MenuItem> */}
      </Select>
    </FormControl>
  )
}

export default memo(PayStatusSelect);
