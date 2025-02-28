  import { forwardRef, memo, useEffect, useState } from 'react';
  import Button from '@mui/material/Button';
  import Dialog from '@mui/material/Dialog';
  import List from '@mui/material/List';
  import AppBar from '@mui/material/AppBar';
  import Toolbar from '@mui/material/Toolbar';
  import IconButton from '@mui/material/IconButton';
  import Typography from '@mui/material/Typography';
  import CloseIcon from '@mui/icons-material/Close';
  import Slide from '@mui/material/Slide';
import UpdateForm from './UpdateForm';
  
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const UpdateCustomer = ({open,setOpen,data}) => {
    const [newData, setNewData] = useState({});

  
    const handleClose = () => {
      setNewData({})
      setOpen(false);
    };

  const updateCustomer = () => {
    handleClose()
  };

    useEffect(() => {
      setNewData(data)
    }, [])
  
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative',background:"#171A1C"}}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Update
          </Typography>
         
        </Toolbar>
      </AppBar>
      <List>
        <UpdateForm 
          data={data}
          setNewData={setNewData}
          newData={newData}
        />
      </List>
      <Button sx={{width:"300px", alignSelf:"center", m:3}} variant="contained" onClick={updateCustomer}>
        <Typography variant="h6" component="div">
            Save
        </Typography>
      </Button>
    </Dialog>
  );
}

export default memo(UpdateCustomer);
