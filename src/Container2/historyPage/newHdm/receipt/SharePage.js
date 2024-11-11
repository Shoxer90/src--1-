import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ShareUsingPhone from '../../../dialogs/ShareUsingPhone';
import { Dialog, Slide } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      { value === index && <Box sx={{ p: 3 }}>{children}</Box> }
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SharePage({
  t, 
  open, 
  recieptId, 
  setOpen, 
  handleClickOpen,
  setMessage
}) {
  const theme = useTheme();
  const [value, setValue] =useState(0);
  
  const handleChangeIndex = (event,num) => setValue(num)

  return (
    <Dialog
      open={!!open}
      TransitionComponent={Transition}
    >
      <Tabs
        TabIndicatorProps={{
          style: {backgroundColor: 'white'}
        }}
        value={value}
        onChange={handleChangeIndex}
        indicatorColor="inherit"
        variant="fullWidth"
      >
        <Tab label={t("history.sendToPhone")}
          {...a11yProps(0)} 
          sx={{fontSize: 11}} 
        />
        <Tab label={t("history.sendToMail")}
          {...a11yProps(1)} 
          sx={{fontSize: 13}} 
        />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <ShareUsingPhone 
          t={t}
          plchld="phone"
          recieptId={recieptId} 
          handleClickOpen={handleClickOpen}
          setMessage={setMessage}
          value={value}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ShareUsingPhone 
          t={t}
          plchld="email"
          recieptId={recieptId}
          handleClickOpen={handleClickOpen}
          setMessage={setMessage}
          value={value}
        />
      </TabPanel> 
    </Dialog>
  );
}
