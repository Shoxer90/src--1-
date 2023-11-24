import React, { memo } from 'react';

import { FormControl, InputLabel, NativeSelect } from '@mui/material';

const ActivateCreditCard = ({t, userCardInfo,currentCard, changeActiveCard}) => {

  return (
    <FormControl sx={{minWidth:"200px",mt:10}} >
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        {t("cardService.chooseCard")}
      </InputLabel>
      <NativeSelect
        onChange={(e)=>changeActiveCard(e.target.value)}
        value={currentCard}
      >
        {userCardInfo && userCardInfo.map((card) => (
          <option key={card?.id} value={card?.id}>{card?.bank}</option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}

export default memo(ActivateCreditCard);
