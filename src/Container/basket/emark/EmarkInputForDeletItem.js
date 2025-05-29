import { Box, Button, Card, Dialog, Divider, TextField } from "@mui/material"
import { memo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import useDebonce from "../../../Container2/hooks/useDebonce";



const EmarkInputForDeleteItem = ({open, close}) => {

  const [loading, setLoading] = useState(false);
  const [emark, setEmark] = useState("");
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState({});
  const debounceBasket = useDebonce(emark, 1000);
  const {t} = useTranslation();

  const addEmarkList = async() => {
    setMessage({type:1, message:""})
 
    setLoading(true)
    const fromStorage = await JSON.parse(localStorage.getItem("emarkList"));
  
    const filtered =  fromStorage && fromStorage.filter((item) => item !== emark)
    if (filtered?.length < fromStorage?.length) {
      localStorage.setItem("emarkList", JSON.stringify(filtered))
      setEmark("")
      setMessage({type:1, message:t("settings.removed")})
    }else{
      setMessage({
        type: 0,
        message: t("mainnavigation.searchEmarkconcl")
      })
    }
      setLoading(false)
  };

  const checkCount = async() => {
    const countOfEmark = await JSON.parse(localStorage.getItem("emarkList"))?.length || 0
    return countOfEmark
  };

  useEffect(() => {
    setMessage({type:null,message:""})
    emark && debounceBasket && addEmarkList(debounceBasket)
  }, [debounceBasket]);

  useEffect(() => {
    checkCount().then((res)=> {
      console.log(res, "teeeee")
      setCount(res)
    })
    // setCount(JSON.parse(localStorage.getItem("emarkList"))?.length)
  }, [loading]);

  useEffect(() => {
    setCount(JSON.parse(localStorage.getItem("emarkList"))?.length)
    setEmark("")
  }, [close, open])

  return(
    <Dialog open={open}>
      <Card 
        style={{
          display:"flex",
          justifyContent:"center",
          flexFlow:"column"
        }}
      >
        <Box 
          style={{
            display:"flex", 
            justifyContent:"space-between",
            alignItems: "center",
            gap:"20px"
          }}
        >
          <h5 style={{padding:"10px 25px"}}>
            Scan Emark code for removing from basket
          </h5>
          <Button onClick={close} style={{textTransform: "capitalize"}}>
            <CloseIcon />
          </Button>
        </Box>
        <Divider color="black" />
        {count && <div style={{alignSelf:"center", padding:"10px",fontWeight:600}}>{ `zambyuxum arka e ${count} emark droshmanishov apranq. Ete veradarcvox apraqn uni emark kod,skanavoreq ayn cucakic hanelu hamar`}</div>}
        {/* <div style={{alignSelf:"center", padding:"10px",fontWeight:600}}>{count === 0  ? "zambyuxum arka che emark droshmavormamb apranq": `zambyuxum arka e ${count} emark droshmanishov apranq. Ete veradarcvox apraqn uni emark kod,skanavoreq ayn cucakic hanelu hamar`}</div> */}
        <TextField
          focused={true}
          autoComplete="off"
          size="small"
          type="text"
          value={emark}
          onChange={(e)=>{
            setMessage({message:"", type:0})
            setLoading(true)
            setEmark(e.target.value)
          }}
          style={{margin:"20px",width:"80%", alignSelf:"center"}}
        />
          {message?.message && <div style={{color:message?.type?"green":"red", alignSelf:"center"}}>{message?.message}</div>}

          <Button
            onClick={close}
            endIcon={loading && <CircularProgress size="20px" color="inherit" />}
            variant="contained"
            style={{width:"150px",alignSelf:"end", margin:"20px"}}
            disabled={loading}
          >
            {loading ? "Send" : "Complete"}
          </Button>
      </Card>
    </Dialog>
  )
};

export default memo(EmarkInputForDeleteItem);
