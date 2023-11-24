
import React from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import { memo } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  top:"-19px",
  right:"20px",
  
  '&.Button-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(0),
    right: theme.spacing(0),
  },
  '&.Button-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(0),
    left: theme.spacing(0),
  },
}));


const AddProductNavigation = ({t,setOpenNewProduct}) => {
  const redirect = useNavigate()


  const actions = [
    { icon:
      <Button 
        onClick={()=>setOpenNewProduct(true)}
        style={{fontSize:"70%", justifyContent:"flex-start"}}
        fullWidth={true} 
        startIcon= {<ControlPointIcon />}
      > 
        {t("mainnavigation.newproduct")}
      </Button> 
    },
    { icon:
      <Button 
        onClick={()=>redirect("/excel")}
        style={{fontSize:"70%", justifyContent:"flex-start"}}
        fullWidth={true} 
        startIcon={<InstallDesktopIcon />}
      >
        {t("mainnavigation.multipleproduct")}
      </Button>
    },
  ];
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 0 }}>
      <Box sx={{zIndex: 320}}>
        <StyledSpeedDial
          sx={{ 
            '& .MuiFab-primary': { 
              width:"auto",
              fontSize:60, 
              height: 30,
              borderRadius:"5px" ,
              overflow:'hidden'
            } 
          }}
          ariaLabel="SpeedDial playground example"
          icon={ 
            <Button style={{fontSize:"20%", color:"white"}}>
              {t("mainnavigation.newproduct")} 
            </Button>
          }
          direction={"down"}
        >
          {actions.map((action) => (
            <SpeedDialAction
              sx={{width:200, borderRadius:2,margin:.1}}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </StyledSpeedDial>
      </Box>
  </Box>
  )
}

export default memo(AddProductNavigation);
