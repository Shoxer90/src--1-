import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const PayStatusSelect = ({
  status,
  initDate,
  getHistoryByStartAndEndDates
}) => {

    const {t} = useTranslation();

  return(
    <FormControl  sx={{ m: 1, width: 170 }} >
      <InputLabel>{t("settings.status")}</InputLabel>
      <Select       
        size="small"
        value={status}
        label={t("settings.status")}
        onChange={(e) => getHistoryByStartAndEndDates(e.target.value, 1, initDate)}
      >
        <MenuItem value="Paid"> {t("history.paid")} </MenuItem>
        <MenuItem value="Prepayment"> {t("history.prepaymentRedemption")} </MenuItem>
        <MenuItem value="Canceled"> {t("history.canceled")} </MenuItem>
        <MenuItem value="Unpaid"> {t("history.no_paid")} </MenuItem>
      </Select>
    </FormControl>
  )
}

export default memo(PayStatusSelect);
