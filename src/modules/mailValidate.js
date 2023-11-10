import validator from "validator";

export const mailValidate = (e) => {
    if(validator.isEmail(e)) {
      return true
    }else{
      return false
    }
  };