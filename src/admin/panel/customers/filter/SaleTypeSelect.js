import { memo } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setPaginationPath } from "../../../../store/pagination/paginationSlice";

  const SaleTypeSelect = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const search = useLocation().search;
    const type = + (new URLSearchParams(search).get("type")) || 1 ;
    const {t} = useTranslation();

    const handleTypeChange = (newtype) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("type", newtype);
      newSearchParams.set("page", 1);
      dispatch(
        setPaginationPath({
          path:`${location.pathname}?${newSearchParams.toString()}`
        })
      )
  };
    
  return(
    <FormControl sx={{ m: 1, width: 220 }} >
      <InputLabel>{t("settings.status")}</InputLabel>
      <Select       
        value={type}
        label={t("settings.status")}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <MenuItem value="1"> {t("history.paid")} </MenuItem>
        <MenuItem value="2"> {t("history.no_paid")} </MenuItem>
        <MenuItem value="3"> {t("history.canceled")} </MenuItem>
        <MenuItem value="4"> {t("history.prepaymentRedemption2")} </MenuItem>
        <MenuItem value="5"> {t("history.canceledFull")} </MenuItem>
      </Select>
    </FormControl>
  )
}

export default memo(SaleTypeSelect);
