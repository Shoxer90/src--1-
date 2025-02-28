import { memo, useEffect } from "react";
import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import styles from "../index.module.scss";
import { columnNames } from "../../../../services/baseUrl";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {setCollTitle, setCollumns} from "../../../../store/filter/collumnFilterSlice";

const CollumnSelect = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const collSlice = useSelector((state)=>state?.collumnFilter)

  const columnChoose = async(key) => {
    const filterColls = collSlice?.collumns.map((item) => {
      if(item?.key === key) {
      return  {...item, checked:!item?.checked}
      } else{
        return item
      }
    })
    localStorage.setItem("historyColumn", JSON.stringify(filterColls))
    dispatch(setCollumns(filterColls))
  };

  useEffect(() => {
    let arr = []
    collSlice?.collumns.forEach((item) => {
      if(item.checked){
        arr.push(item?.key)
      }
    })
    dispatch(setCollTitle(arr))
  }, [collSlice?.collumns])

  return (
    <div className={styles.customer_filterPanel_collumnSelect}>
      <FormControl sx={{ m: 1, width: 200 }}>
        <Select
          multiple
          value={[t("history.activeColumns")]}
          input={<OutlinedInput label="" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {collSlice?.collumns?.map((name) => (
            <MenuItem key={name?.id} value={name?.key} name={name?.title} onClick={() =>{columnChoose(name?.key)}}>
              <Checkbox checked={name?.checked} />
              <ListItemText primary={t(name?.title)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
};

export default memo(CollumnSelect);
