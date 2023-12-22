import React, { memo, useState, useEffect } from "react" ;
import Cashiers from "../cashiers/Cashiers";
import ClientCardContainer from "../serviceAmount";
import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";
import { Card, Divider } from "@mui/material";
import SettingsCard from "./settingCard/index";
import LeftTop from "./settingCard/components/user/LeftTop";
import LeftTopCashiers from "./settingCard/components/cashiers/LeftTopCashiers";
import LeftTopServices from "./settingCard/components/services/LeftTopServices";
import LeftBottomServices from "./settingCard/components/services/LeftBottomServices";
import LeftBottom from "./settingCard/components/user/LeftBottom";
import LeftBottomCashiers from "./settingCard/components/cashiers/LeftBottomCashiers";
import RightBottom from "./settingCard/components/user/RightBottom";
import RightTop from "./settingCard/components/user/RightTop";
import { useNavigate } from "react-router-dom";
import { getCashiers } from "../../../services/user/userInfoQuery";

const SettingsContent = ({
  user,
  synth,
  setSynth,
  setMessage,
  setType,
}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [cashiers,setCashiers] = useState();


  useEffect(() => {
    getCashiers().then((res) => {
      setCashiers(res.data)
    })
  }, []);
// }, [register]);


  return (
    <div style={{width:"100%",display:"flex"}}>
      <SettingsCard
        leftTop={
          <LeftTop  
            synth={synth} 
            setSynth={setSynth}
            setMessage={setMessage}
            setType={setType}
            mainContent={user}
          />
        }
        rightTop={<RightTop />}
        leftBottom={<LeftBottom mainContent={user} />}
        rightBottom={<RightBottom mainContent={user} />}
        func={(e)=>{
          navigate("/setting/user")}
        }
      />

      {cashiers && 
        <SettingsCard
          leftTop={
            <LeftTopCashiers cashiers={cashiers} />
          }
          rightTop={<RightTop />}
          leftBottom={<LeftBottomCashiers cashiers={cashiers} t={t} />}
          // rightBottom={<RightBottom mainContent={user} />}
          func={()=>navigate("/setting/cashiers")}
        />
      }
        <SettingsCard
          leftTop={
            <LeftTopServices />
          }
          rightTop={<RightTop />}
          leftBottom={<LeftBottomServices t={t} />}
          // rightBottom={<RightBottom mainContent={user} />}
          func={()=>navigate("/setting/services")}
        />
    </div>
  )
};

export default memo(SettingsContent);
