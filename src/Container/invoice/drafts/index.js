import { memo, useEffect, useState } from 'react'
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { getDraftsByType } from '../../../services/invoice/customerData';
import SnackErr from '../../../Container2/dialogs/SnackErr';
import { Dialog } from '@mui/material';
import DraftsTable from './DraftsTable';

const date = new Date();
date.setMonth(date.getMonth() - 1);
const oneMonthBefore = date.toISOString();
const initialFetchData = {
  "page": 1,
  "count":10,
  "isPayd": false,
  "searchString": "",
  "byDate": {
    "startDate": oneMonthBefore,
    "endDate": new Date().toISOString()
  },
};

const InvoiceDrafts = ({ behalfOfArr,setBehalfOfArr}) => {
  const [data, setData] = useState(initialFetchData);
  const [activeField, setActiveField] = useState(null);
  const [contentCount, setContentCount] = useState(0);
  const [message, setMessage] = useState({text:"", type:""});
  const [draftsByType, setDraftsByType] = useState(null);
  const [clicked, setIsClicked] = useState(false)
  const [upload, setUpload] =useState(false);
  
  const {t} = useTranslation();

  const invoiceButtons = [{ title:"invoice.taxInvoiceDraftBtn"},{ title: "invoice.invoiceDraftBtn"  }];

  const getNeedDrafts = (num) => {
    setActiveField(num)
    getDraftsByType(num, data).then((res) => {
      if(res?.status === 200) {
        setContentCount(res?.headers?.count)
        setDraftsByType(res?.data)
      }else {
        setMessage({
          text:res?.message,
          type:"error"
        })
      }
    })
  };

  const closeMessage = () => {
    setMessage({
      text:"",
      type:""
    })
    setUpload(!upload)
  }
  
  useEffect(() => {
    clicked && getNeedDrafts(activeField)
  },[activeField, data?.page, upload])
  
  return (
    <div>
      <h5>
        {t("invoice.drafts")}
      </h5>
      <div style={{display:"flex",justifyContent:"space-around",marginBottom:"20px", gap:"20px", color:"grey"}}>
        {invoiceButtons?.length && 
          invoiceButtons?.map((btn, index) => {
            return <Button
              variant='outlined' 
              key={index}
              onClick={()=> {
                setData({...data, page:1})
                setIsClicked(true)
                setActiveField(index)}
              }
              style={{background:activeField === index? "orange": "white",color:activeField === index? "white": "black" }}
            >
             {t(`${btn.title}`)}
            </Button>
          })
        }

      </div>

          {draftsByType && 
          <div >
            <DraftsTable 
              data={data}
              setData={setData}
              content={draftsByType} 
              behalfOfArr={behalfOfArr} 
              contentCount={contentCount} 
              setMessage={setMessage}
            />
          </div>
          }

      {message?.text && 
        <Dialog open={!!message?.text}>
          <SnackErr 
            message={message?.text}
            type={message?.type}
            close={closeMessage}
          />
        </Dialog>
      }
    </div>
  )
}

export default memo(InvoiceDrafts);
