import { Button } from "@mui/material";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from "react-i18next";


const BackAndOkBtnGrp = ({link, func, btnName}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  return(
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <Button 
        variant="contained" 
        style={{background:"orange"}}
        onClick={()=>navigate(link)} 
        startIcon={<ArrowBackIcon  fontSize="small"/>}
      >
        {t("buttons.back")} 
      </Button> 
      <Button 
        variant="contained" 
        style={{}} 
        onClick={()=>func()}
      >
       {btnName}    
      </Button>
    </div>
  )
};

export default memo(BackAndOkBtnGrp);
