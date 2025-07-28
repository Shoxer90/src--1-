import { useState, memo } from "react";

import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

const ColumnSelect = ({columns,setColumns}) => {
  const {t} = useTranslation();
  const [names,setNames] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
      
  const columnChoose = async(key) => {
    const cols = await JSON.parse(localStorage.getItem("historyColumn"))
    const filterCols = cols.map((item) => {
      if(item?.key === key) {
      return  {...item, checked:!item?.checked}
      } else{
        return item
      }
    })
    localStorage.setItem("historyColumn", JSON.stringify(filterCols))
    setColumns(filterCols)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }}>
        <Select
          size="small"
          multiple
          name={columns?.title}
          value={[t("history.activeColumns")]}
          onChange={handleChange}
          input={<OutlinedInput label="" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {columns.map((name) => (
            <MenuItem key={name?.id} value={name?.key} name={name?.title} onClick={() =>{columnChoose(name?.key)}}>
              <Checkbox checked={name?.checked} />
              <ListItemText primary={t(name?.title)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default memo(ColumnSelect);
