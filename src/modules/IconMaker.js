import { Checkbox } from "@mui/material";
import { memo } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
const IconMaker = ({
  setNotifIdArr,
  notifIdArr,
  choose,
  setChoose,
  id,
  isOpen,
  color,
  size,
  icon,
}) => {
  const circleStyle = {
    background: color,
    height: size,
    width: size,
    borderRadius:"50%",
    display:'flex',
    justifyContent: "center",
    alignItems:"center",
    marginRight: "5px",
    // opacity:isOpen ? 0.3: 0.9
  }

  const iconStyle = {
    paddingBottom: "4px"
  }

  return (
    <div style={circleStyle}>
      {choose ?
        <Checkbox 
          name="id"
          style={{opacity:1}}
          color="default"
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          checked={notifIdArr.includes(id)}
          onChange={(e)=>{
            e.target.checked ?
              setNotifIdArr([id,...notifIdArr,]):
              setNotifIdArr(prev=>prev.filter(item => item !== id))
            }
          }
        />:
        <span style={iconStyle}  
          onClick={()=>{
            if(!choose) {
              setNotifIdArr([ id, ...notifIdArr])
              setChoose(true)
            }
          }}
        >
          {icon}
        </span>
      }
    </div>
  )
};

export default memo(IconMaker);
