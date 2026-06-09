import { memo, useEffect, useState } from 'react'
import { getComunities, getInvoiceTableDataByName, getRegions, getResidence } from '../../services/invoice/customerData'
import { useTranslation } from 'react-i18next';
import { Input, Select } from 'antd';
import { Checkbox, Dialog, FormControlLabel, TextField } from '@mui/material';
import Loader from '../../Container2/loading/Loader';
import TinInput from './TinInput';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useUnsavedChangesPrompt } from '../../modules/ConfirmExid';

const selectStyle = {
  marginLeft:"0px",
  width:"19%",
};

const CustomerInputs = ({
  user,
  invoicePaymentInfo,
  setInvoicePaymentInfo,
  isService,
  behalfOfArr,
  

}) => {
  const {t} = useTranslation();
  const [regions, setRegions] = useState([]);
  const [comunitySourse, setComunitySourse] = useState([]);
  const [comunityDestination, setComunityDestination] = useState([]);
  const [residenceSourse, setResidenceSourse] = useState([]);
  const [residenceDestination, setResidenceDestination] = useState([]);
  const [load, setLoad] = useState(false);
  const [validTin, setValidTin] = useState(false);
  const [isReqTin, setIsReqTin] = useState(true);

  const onChange = (name,value,label) => {
    if(name === "sourceRegionId") {
      setInvoicePaymentInfo({
        ...invoicePaymentInfo,
        invoiceInfo:{
          ...invoicePaymentInfo?.invoiceInfo,
          "sourceCommunityId" : undefined,
          "sourceRegion":label,
          [name] : value,

        }
      })
    }else if(name === "destinationRegionId") {
      setInvoicePaymentInfo({
        ...invoicePaymentInfo,
        invoiceInfo:{
          ...invoicePaymentInfo?.invoiceInfo,
          "destinationCommunityId" : undefined,
          "destinationCommunity" : undefined,
          "destinationRegion":label,
          [name] : value,
        }
      })
    }else if(name === "destinationCommunityId") {
      setLoad(true)
      getResidence(value).then((res) => {
        setLoad(false)
        setInvoicePaymentInfo({
          ...invoicePaymentInfo,
          invoiceInfo:{
            ...invoicePaymentInfo?.invoiceInfo,
            "destinationResidenceId": res[0].id,
            "destinationResidence": res[0].name,
            "destinationCommunityId": value,
            "destinationCommunity": label
          }
        })
        setResidenceDestination(res)
      })
    }else if(name ==="sourceCommunityId") {
      setLoad(true)
      getResidence(value).then((res) => {
      setLoad(false)
        setInvoicePaymentInfo({
        ...invoicePaymentInfo,
        invoiceInfo:{
          ...invoicePaymentInfo?.invoiceInfo,
          "sourceResidenceId": res[0].id,
          "sourceResidence": res[0].name,
          "sourceCommunityId": value,
          "sourceCommunity": label
        }
      })
      setResidenceSourse(res)
    })
    }else {
      setInvoicePaymentInfo({
        ...invoicePaymentInfo,
        invoiceInfo:{
          ...invoicePaymentInfo?.invoiceInfo,
          [name] : value
        }
      })
    }
  };

  const getSelectData = () => {
    setLoad(true)
    getRegions().then((data) => {
      setLoad(false)
      setRegions(data)
    })
    if(invoicePaymentInfo?.invoiceInfo?.destinationResidenceId){
      setLoad(true)
      getResidence(invoicePaymentInfo?.invoiceInfo?.destinationResidenceId).then((data) => {
        setResidenceDestination(data)
        setLoad(false)
      })
    } 
    if(invoicePaymentInfo?.invoiceInfo?.sourceResidenceId) {
      setLoad(true)
      getResidence(invoicePaymentInfo?.invoiceInfo?.sourceResidenceId).then((data) => {
        setResidenceSourse(data)
        setLoad(false)
      })
    }
    if(invoicePaymentInfo?.invoiceInfo?.destinationRegionId) {
      comunityCheck(invoicePaymentInfo?.invoiceInfo?.destinationRegionId).then((res) => {
        setLoad(false)
        setComunityDestination(res)
      })
    }
    if(invoicePaymentInfo?.invoiceInfo?.sourceRegionId) {
      comunityCheck(invoicePaymentInfo?.invoiceInfo?.sourceRegionId).then((res) => {
        setLoad(false)
        setComunitySourse(res)
      })
    }
  };

  const getSelectData2 = (str) => {
     setLoad(true)
    if(str === "destinationCommunityId" && invoicePaymentInfo?.invoiceInfo?.destinationResidenceId){
      setLoad(true)
      getResidence(invoicePaymentInfo?.invoiceInfo?.destinationResidenceId).then((data) => {
        setResidenceDestination(data)
        setLoad(false)
      })
    } 
    if(str === "sourceCommunityId" && invoicePaymentInfo?.invoiceInfo?.sourceResidenceId) {
      setLoad(true)
      getResidence(invoicePaymentInfo?.invoiceInfo?.sourceResidenceId).then((data) => {
        setResidenceSourse(data)
        setLoad(false)
      })
    }
    if(str === "destinationRegionId" && invoicePaymentInfo?.invoiceInfo?.destinationRegionId) {
      comunityCheck(invoicePaymentInfo?.invoiceInfo?.destinationRegionId).then((res) => {
        setLoad(false)
        setComunityDestination(res)
      })
    }
    if(str === "sourceRegionId" && invoicePaymentInfo?.invoiceInfo?.sourceRegionId) {
      comunityCheck(invoicePaymentInfo?.invoiceInfo?.sourceRegionId).then((res) => {
        setLoad(false)
        setComunitySourse(res)
      })
    }
  };

  const comunityCheck = async(id) => {
    const data = await getComunities(id)
    return data
  };


  useEffect(() => {
    getSelectData()
  }, [
    invoicePaymentInfo?.invoiceInfo?.destinationRegionId,
    invoicePaymentInfo?.invoiceInfo?.sourceRegionId,
  ]);

// առմենիա այդի 
// 8c961171-8f04-32ac-8dd0-baf0903d22e5
  return (
    <div>
     {regions ? <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div aria-autocomplete='false' style={{display:"flex", justifyContent:"flex-start", gap:"10px"}}>
         {behalfOfArr ? <Select
            placeholder="Հաշվարկային փաստաթղթի ձև"
            value={invoicePaymentInfo?.invoiceInfo?.behalfOf}
            onChange={(value)=>{
               setInvoicePaymentInfo({
                ...invoicePaymentInfo,
                invoiceInfo:{
                  ...invoicePaymentInfo?.invoiceInfo,
                "behalfOf" : value
                }
              })
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            size="large"
            options={
              behalfOfArr?.map((type) => {
                return {
                  value:type.id,
                  label:type.title
                }
              })
            }
          />: ""}
            
             <DatePicker
                style={{minWidth:"150px"}}
                // maxDate={new Date()}
                label="Մատակարարման ամսաթիվ"
                name= "deliveredAt"
                format="DD-MM-YYYY"
                value={
                  invoicePaymentInfo?.invoiceInfo?.deliveredAt
                    ? dayjs(invoicePaymentInfo.invoiceInfo.deliveredAt)
                    : null
                }
                onChange={(val) => {
                  setInvoicePaymentInfo((prev) => ({
                    ...prev,
                    invoiceInfo: {
                      ...prev.invoiceInfo,
                      deliveredAt: val && val.isValid()
                        ? val.toISOString()
                        : null,
                    },
                  }));
                }}
                 renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                  />
                )}
              />   
              </div>
        <div style={{display:"flex", justifyContent:"flex-start",fontWeight:600,fontSize:"120%",margin:"15px 0px",color:"#308ac5"}}>
          Պայմանագիր
        </div>
            <div style={{display:"flex", justifyContent:"flex-start", gap:"10px"}}>
              <DatePicker
                label="Կնքման ամսաթիվ"
                format="DD-MM-YYYY"
                value={
                  invoicePaymentInfo?.invoiceInfo?.dealAt
                    ? dayjs(invoicePaymentInfo.invoiceInfo.dealAt)
                    : null
                }
                onChange={(val) => {
                  setInvoicePaymentInfo((prev) => ({
                    ...prev,
                    invoiceInfo: {
                      ...prev.invoiceInfo,
                      dealAt: val && val.isValid()
                        ? val.toISOString()
                        : null,
                    },
                  }));
                }}
                 renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                  />
                )}
              />  
               <TextField
                label="Համար"
                type='text'
                name="dealNo"
                size="small"
                value={invoicePaymentInfo?.invoiceInfo?.dealNo}
                onChange={(e)=>setInvoicePaymentInfo({
                ...invoicePaymentInfo,
                invoiceInfo:{
                  ...invoicePaymentInfo?.invoiceInfo,
                  "dealNo": e.target.value
                }
              })}
              />
            </div>  
        <div style={{display:"flex", justifyContent:"flex-start",fontWeight:600,fontSize:"120%",margin:"15px 0px",color:"#308ac5"}}>
          {isService ?  t("invoice.servTitle2"):t("invoice.prodTitle2")}
        </div>
         <FormControlLabel
            style={{display:"flex", justifyContent:"flex-start", alignSelf:"start"}}
            control={
              <Checkbox
                onChange={(e)=>{
                    setInvoicePaymentInfo({
                      ...invoicePaymentInfo,
                      invoiceInfo:{
                        ...invoicePaymentInfo?.invoiceInfo,
                        "buyerHasNoTin":e.target.checked
                      }
                    })
                  setIsReqTin(!e.target.checked)
                }}
                checked={!isReqTin}
              />
            }
            label={t("invoice.affordWithoutTin")}
          />
            <TinInput
              setPaymentInfo={setInvoicePaymentInfo}
              paymentInfo={invoicePaymentInfo}
              height="36px"
              validTin={validTin}
              setValidTin={setValidTin}
              isReqTin={isReqTin}
            />
        {!isService ? <div id="selectRow" style={{display:"flex", justifyContent:"space-between", flexFlow:"row wrap", gap:"10px", margin:"15px 0px",color:"#308ac5"}}>

          <Select
            defaultValue="Հայաստան"
            style={selectStyle}
            disabled
          />

          {regions ?<Select
            placeholder={t("invoice.region")}
            value={invoicePaymentInfo?.invoiceInfo?.destinationRegionId}
            onChange={(value,opt)=>{
              const option = regions.find((opt) => opt.value === value)
              onChange("destinationRegionId", option || value, opt.label)
              getSelectData2("destinationRegionId")
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={selectStyle}
            options={
              regions?.map((country) => {
                return {
                  value:country.id,
                  label:country.name
                }
              })
            }
          />:""}
          
          <Select
            placeholder={t("invoice.community")}
            value={invoicePaymentInfo?.invoiceInfo?.destinationCommunityId}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={selectStyle}
            options={
              comunityDestination?.map((country) => {
                return {
                  value:country.id,
                  label:country.name
                }
              })
            }
            onChange={(value,opt)=>{
              const option = comunityDestination.find((opt) => opt.value === value)
              onChange("destinationCommunityId", option || value, opt.label)
              getSelectData2("destinationCommunityId")
            }}
          />


            <Select
              placeholder={t("invoice.residence")}
              value={invoicePaymentInfo?.invoiceInfo?.destinationResidenceId}
              onChange={(value, opt)=>{
                const option = residenceDestination?.find((opt) => opt.value === value)
                onChange("destinationResidenceId",option || value, opt.label)
                getSelectData2("destinationResidenceId")

              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              style={selectStyle}
              options={
                 residenceDestination?.map((country) => {
                  return {
                    value:country.id,
                    label:country.name
                  }
                })
              }
            />
            <Input 
              style={selectStyle}
              prefix={`${t("authorize.address")}`} 
              value={invoicePaymentInfo?.invoiceInfo?.destinationStreet}
              onChange={(e)=>{
                onChange("destinationStreet", e.target.value)
              }}
            />
          </div>:""}
     <div>
        <div style={{display:"flex", justifyContent:"flex-start",fontWeight:600,fontSize:"120%",margin:"15px 0px",color:"#308ac5"}}>
          {isService ?  t("invoice.servTitle"):t("invoice.prodTitle")}
        </div>
        <div style={{display:"flex",justifyContent:"start"}}>
          { user?.tin ?
            <span>
              <span style={{fontWeight:600,marginRight:"10px", fontSize:"16px"}}> {user?.tin}</span>
              <span style={{fontWeight:600,marginRight:"10px"}}>"{`${user?.legalName}`}"</span>
              <span>{user?.legalAddress}</span>
            </span>: null
          }
        </div>
         {!isService ? <div id="selectRow" style={{display:"flex", justifyContent:"space-between", flexFlow:"row wrap", gap:"10px", margin:"15px 0px",color:"#308ac5"}}>

          <Select
            style={selectStyle}
            defaultValue="Հայաստան"
            disabled
          />
          <Select
            placeholder={t("invoice.region")}
            value={invoicePaymentInfo?.invoiceInfo?.sourceRegionId}
            onChange={(value,opt)=>{
              const option = regions.find((opt) => opt.value === value)
              onChange("sourceRegionId",option || value, opt.label)
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={selectStyle}
            options={
              regions?.map((country) => {
                return {
                  value:country.id,
                  label:country.name
                }
              })
            }
          />
            <Select
              placeholder={t("invoice.community")}
              value={invoicePaymentInfo?.invoiceInfo?.sourceCommunityId}
              onChange={(value,opt)=>{
                const option = comunitySourse.find((opt) => opt.value === value)
                onChange("sourceCommunityId", option || value, opt.label)
                getSelectData2("sourceCommunityId")

              }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              style={selectStyle}
              options={
                comunitySourse?.map((country) => {
                  return {
                    value:country.id,
                    label:country.name
                  }
                })
              }
            />
          <Select
            placeholder={t("invoice.residence")}
            value={invoicePaymentInfo?.invoiceInfo?.sourceResidenceId}
            onChange={(value, opt)=> {
              const option = residenceSourse.find((opt) => opt.value === value)
              onChange("sourceResidenceId", option || value, opt.label)
              getSelectData2("sourceResidenceId")
            }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            style={selectStyle}
            options={
              residenceSourse?.map((country) => {
                return {
                  value:country.id,
                  label:country.name
                }
              })
            }
          />
          <Input 
            style={selectStyle}
            prefix={`${t("authorize.address")}`} 
            value={invoicePaymentInfo?.invoiceInfo?.sourceStreet}
            onChange={(e)=>{
              onChange("sourceStreet", e.target.value)
            }}
          />

        </div>:""}
      </div>
      </LocalizationProvider>
     </div>
     : <Dialog open={Boolean(load)} >
      <Loader close={setLoad} />
   
    </Dialog>
      }
    </div>
  )
}

export default memo(CustomerInputs);
