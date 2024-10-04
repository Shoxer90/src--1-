import { Divider } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const CardContent = ({prod,index}) => {
  const {t} = useTranslation();
  const containerStyle={
    fontWeight: 600,
    padding:"4px 10px",
    display:"flex",
    justifyContent:"space-between",
    textAlign:"center",
    fontSize:"80%"
  }
  return(
  <>
    <div style={containerStyle}>
      <span>
       {index+1}.
       <span style={{marginLeft:"5px"}}>{prod?.name?.length > 16? `${prod?.name?.slice(0,16)}...` : prod?.name}</span>
      </span>
      <span style={{fontSize:"70%"}}>{prod?.count} {t(`units.${prod?.unit}`)} * {prod?.discountedPrice}{t("units.amd")}</span>
    </div>
    <Divider color="black" sx={{ml:1, mr:1}} />
  </>
  )
};

export default memo(CardContent);
