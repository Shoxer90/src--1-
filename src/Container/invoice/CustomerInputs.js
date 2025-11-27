import { memo, useEffect, useState } from 'react'
import { getComunities, getCountries, getRegions, getResidence } from '../../services/invoice/customerData'
import { useTranslation } from 'react-i18next';
import { Input, Select } from 'antd';
import { Dialog } from '@mui/material';
import Loader from '../../Container2/loading/Loader';
  const selectStyle = {
    margin:"5px",
    width:"30%"
  }
const CustomerInputs = ({
  paymentInfo,
  setPaymentInfo
  }) => {
  const {t} = useTranslation();
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [comunitySourse, setComunitySourse] = useState([]);
  const [comunityDestination, setComunityDestination] = useState([]);
  const [residenceSourse, setResidenceSourse] = useState([]);
  const [residenceDestination, setResidenceDestination] = useState([]);
  const [load, setLoad] = useState(false);
  
  

  const onChange = (name,value) => {

    if(name === "sourceRegionId") {
      setPaymentInfo({
        ...paymentInfo,
        invoiceInfo:{
          ...paymentInfo?.invoiceInfo,
          "sourceCommunityId" : undefined,
          [name] : value
        }
      })
    }else if(name === "destinationRegionId") {
     setPaymentInfo({
        ...paymentInfo,
        invoiceInfo:{
          ...paymentInfo?.invoiceInfo,
          "destinationCommunityId" : undefined,
          [name] : value
        }
      })
  }
 
  else if(name === "destinationCommunityId") {
    setLoad(true)
    getResidence(value).then((res) => {
      setLoad(false)
      setPaymentInfo({
        ...paymentInfo,
        invoiceInfo:{
          ...paymentInfo?.invoiceInfo,
          "destinationResidenceId": res[0].id,
          "destinationCommunityId": value,
        }
      })
      setResidenceDestination(res)
   })
  }else if(name ==="sourceCommunityId") {
    setLoad(true)
    getResidence(value).then((res) => {
    setLoad(false)
      setPaymentInfo({
        ...paymentInfo,
        invoiceInfo:{
          ...paymentInfo?.invoiceInfo,
          "sourceResidenceId": res[0].id,
          "sourceCommunityId": value
        }
      })
    setResidenceSourse(res)
   })
  }else {
      setPaymentInfo({
      ...paymentInfo,
      invoiceInfo:{
        ...paymentInfo?.invoiceInfo,
        [name] : value
      }
    })
  }
  };

  const getSelectData = () => {
    setLoad(true)
    getCountries().then((data) => {
      setLoad(false)
      setCountries(data)
    })

    getRegions().then((data) => {
      setLoad(false)
      setRegions(data)
    })

    if(paymentInfo?.invoiceInfo?.destinationResidenceId){
    setLoad(true)

      getResidence(paymentInfo?.invoiceInfo?.destinationResidenceId).then((data) => {
        setResidenceDestination(data)
        setLoad(false)
      })
    } 
    if(paymentInfo?.invoiceInfo?.sourceResidenceId) {
    setLoad(true)

      getResidence(paymentInfo?.invoiceInfo?.sourceResidenceId).then((data) => {
        setResidenceSourse(data)
        setLoad(false)
      })
    }
  };

  const comunityCheck = async(id) => {
    const data = await getComunities(id)
    return data
  };

  const residenceCheck = async(id) => {
    const data = await getResidence(id)
    return data
  } 

  useEffect(() => {
    getSelectData()
  }, []);

  useEffect(() => {
    paymentInfo?.invoiceInfo?.destinationRegionId &&
      comunityCheck(paymentInfo?.invoiceInfo?.destinationRegionId).then((res) => {
        setLoad(false)
        setComunityDestination(res)
    })
  }, [paymentInfo?.invoiceInfo?.destinationRegionId]);

  useEffect(() => {
    paymentInfo?.invoiceInfo?.sourceRegionId &&
    comunityCheck(paymentInfo?.invoiceInfo?.sourceRegionId).then((res) => {
      setLoad(false)
      setComunitySourse(res)
    })
  }, [paymentInfo?.invoiceInfo?.sourceRegionId]);

  
// առմենիա այդի 
// 8c961171-8f04-32ac-8dd0-baf0903d22e
  return (
    <div>
    {/* <div style={{height:"600px"}}> */}
     { countries?.length && regions ? <div style={{display:"flex",flexFlow:"column"}}>
      <div>
          <h5>{t("basket.customer")}</h5>

          <Select
            defaultValue="Հայաստան"
            style={selectStyle}
            disabled
          />
          {/* {regions &&  */}
            <Select
              placeholder={t("invoice.region")}
              value={paymentInfo?.invoiceInfo?.destinationRegionId}
              onChange={(value)=>{
                const option = regions.find((opt) => opt.value === value)
                onChange("destinationRegionId", option || value)
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
          {/* }
          {paymentInfo?.invoiceInfo?.destinationRegionId && comunityDestination &&  */}
            <Select
              placeholder={t("invoice.community")}
              value={paymentInfo?.invoiceInfo?.destinationCommunityId}
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
              onChange={(value)=>{
                const option = comunityDestination.find((opt) => opt.value === value)
                onChange("destinationCommunityId", option || value)
              }}
            />
          {/* }
          {residenceDestination && comunityDestination  && <> */}
            <Select
              placeholder={t("invoice.residence")}
              value={paymentInfo?.invoiceInfo?.destinationResidenceId}
              onChange={(value)=>{
                const option = residenceDestination?.find((opt) => opt.value === value)
                onChange("destinationResidenceId",option || value)
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
              style={{width:"62%", margin:"5px"}}
              prefix={`${t("authorize.address")}`} 
              value={paymentInfo?.invoiceInfo?.destinationStreet}
              onChange={(e)=>onChange("destinationStreet", e.target.value)}
            />
          {/* </>} */}
      </div>
      <div>
        <h5>{t("basket.supplier")}</h5>

        <Select
          style={selectStyle}
          defaultValue="Հայաստան"
          disabled
        />
        {/* {regions &&  */}
        <Select
          placeholder={t("invoice.region")}
          value={paymentInfo?.invoiceInfo?.sourceRegionId}
          onChange={(value)=>{
            const option = regions.find((opt) => opt.value === value)
            onChange("sourceRegionId",option || value)
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
        {/* }
        {paymentInfo?.invoiceInfo?.sourceRegionId && comunitySourse &&  */}
          <Select
            placeholder={t("invoice.community")}
            value={paymentInfo?.invoiceInfo?.sourceCommunityId}
            onChange={(value)=>{
              const option = comunitySourse.find((opt) => opt.value === value)
              onChange("sourceCommunityId", option || value)
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
        {/* }
         {residenceSourse && comunitySourse && paymentInfo?.invoiceInfo?.sourceCommunityId &&
         <> */}
            <Select
              placeholder={t("invoice.residence")}
              value={paymentInfo?.invoiceInfo?.sourceResidenceId}
              onChange={(value)=> {
                const option = residenceSourse.find((opt) => opt.value === value)
                onChange("sourceResidenceId", option || value)
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
            style={{width:"62%", margin:"5px"}}
            prefix={`${t("authorize.address")}`} 
            value={paymentInfo?.invoiceInfo?.sourceStreet}
            onChange={(e)=>onChange("sourceStreet", e.target.value)}
          />
         {/* </>
          } */}
      </div>
     </div>
     : <Dialog open={Boolean(load)} >
      <Loader close={setLoad} />
    </Dialog>
      }
    </div>
  )
}

export default memo(CustomerInputs);
