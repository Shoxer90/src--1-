import { memo } from "react";
import { createDateFormat } from "../../../admin/modules/variables";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

const NotificationItemLoginPage = ({news, date}) => {

  return(
    <div style={{padding:"10px 0px", fontSize:"90%"}}>
      <div style={{display:"flex", alignSelf:"right", color:"#F69221"}}>{createDateFormat(date, 1, 0)}</div>
      { news && news?.map((item) => {
        return <div> {<DoneOutlineIcon fontSize="small" sx={{color:"#3FB68A"}} />} {item} </div>
      }) }
    </div>
  )
};

export default memo(NotificationItemLoginPage);
