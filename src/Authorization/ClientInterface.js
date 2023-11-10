import  React, { memo } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import styles from "./index.module.scss";
import WelcomeClient from './WelcomeClient';
import LangSelect from '../Container2/langSelect';


const ClientInterface = ({element, t,title, lang,setLang}) => {


  return(
    <div className={styles.auth_container}>
      <Box className={styles.authPage}>
      <span style={{display:"flex", justifyContent:"flex-end"}}>
        {lang && <LangSelect size={"22px"} lang={lang} setLang={setLang} />}
      </span>
        {title}
        <List>        
         {element}
        </List>
      </Box>
      <WelcomeClient t={t} />
    </div>
  );
};

export default memo(ClientInterface);
