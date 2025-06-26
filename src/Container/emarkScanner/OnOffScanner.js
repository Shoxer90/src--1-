import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';
// import { connectScanner, disconnectScanner, } from './ScannerManager';

const OnOffScanner = ({connectScanner,disconnectScanner}) => {
  const {t} = useTranslation();
  return (
    <ButtonGroup>
      <Button variant="contained" size="small" onClick={connectScanner}>
        E-Mark սկաներ
      </Button>
      <Button variant="contained" size="small" onClick={disconnectScanner}>
        ❌ Անջատել
      </Button>
    </ButtonGroup>
  )
};

export default memo(OnOffScanner);

