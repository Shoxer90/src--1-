import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import EmarkAddDialog from "./EmarkAddDialog";

const EmarkButton = () => {
  const [openEmarkPage, setOpenEmarkPage] = useState(false);
  const [isExcel, setIsExcel] = useState(false);
  const {t} = useTranslation();
  
  return (
    <>
      <MenuItem 
        style={{padding:"1px 5px"}}
        fontSize="medium"
        onClick={()=>{
          setIsExcel(false)
          setOpenEmarkPage(true)
        }}
      >
        <div>
          <ControlPointIcon sx={{m:1}}/>
          {t("emark.popBtn1")}
        </div>
      </MenuItem>

      <MenuItem 
        style={{padding:"1px 5px"}}
        fontSize="medium"
        onClick={()=>{
          setIsExcel(true)
          setOpenEmarkPage(true)
        }}
      >
        <div> 
          <InstallDesktopIcon sx={{m:1}}/>
          {t("emark.popBtn2")}
        </div>
      </MenuItem>
      <EmarkAddDialog
        open={openEmarkPage}
        setOpen={setOpenEmarkPage}
        isExcel={isExcel}
      />
    </>
  )
};

export default memo(EmarkButton);
