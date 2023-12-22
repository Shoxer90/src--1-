import React, { useState, useEffect, memo } from "react";
import { Dialog } from "@mui/material";
import SettingsContent from "./content";
import SnackErr from "../dialogs/SnackErr";

const SettingsPage = ({t, whereIsMyUs, user}) => {

  const [synth, setSynth] = useState(false);
  const [type, setType] = useState();
  const [message, setMessage] = useState();  

  useEffect(() => {
    whereIsMyUs()
  }, [synth, message]);

  return( 
    <div
      style={{ 
        marginTop: "75px",
        height: "86vh",
      }}
    >
      <h1>{t("menuburger.setting")}</h1>
      <SettingsContent 
        user={user}
        synth={synth} 
        setSynth={setSynth}
        setMessage={setMessage}
        setType={setType}
        />
      {message && 
        <Dialog open={message}>
          <SnackErr type={type} message={message}/>
        </Dialog>
      }
    </div>
  )
};

export default memo(SettingsPage);
