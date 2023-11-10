import React, { useState, memo } from "react";

import { Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";

const ColumnSelect = ({t,columns,setColumns}) => {
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
          // labelId="demo-multiple-checkbox-label"
          // id="demo-multiple-checkbox"
          multiple
          name={columns?.title}
          value={[t("history.activeColumns")]}
          onChange={handleChange}
          // controlShouldRenderValue={false}
          // hideSelectedOptions={false} 
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
