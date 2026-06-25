import { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";

import { updateCashiersData } from "../../services/user/userInfoQuery";
import { useSuccessSound } from "../../modules/PlaySound";

import styles from "./index.module.scss";

const textFieldSx = { width: "100%" };

const inputProps = {
  style: {
    height: "36px",
    padding: "1px 10px",
  },
};

const UpdateCashiers = ({
  updateDial,
  setUpdateDial,
  updateContent,
  setUpdateContent,
  logOutFunc,
  createMessage,
}) => {
  const { t } = useTranslation();
  const playSuccess = useSuccessSound();

  const [seePass, setSeePass] = useState(false);
  const [password, setPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (updateDial) {
      setPassword("");
      setSeePass(false);
      setSubmitAttempted(false);
    }
  }, [updateDial]);

  const handleClose = () => {
    setUpdateDial(false);
  };

  const handleUpdateCashier = async () => {
    setSubmitAttempted(true);

    if (!updateContent?.email || !updateContent?.firstName || !updateContent?.userName) {
      createMessage({
        message: t("dialogs.empty"),
        type: "error",
      });
      return;
    }

    const body = { ...updateContent };
    delete body.password;

    if (password.trim()) {
      body.password = password.trim();
    }

    await updateCashiersData(body).then((res) => {
      if (res?.status === 200) {
        playSuccess();
        createMessage({
          type: "success",
          message: t("dialogs.done"),
        });
        setUpdateDial(false);
      } else if (res?.response?.status === 405) {
        createMessage({
          message: t("settings.dublicatemail"),
          type: "error",
        });
      } else if (res?.response?.status === 401) {
        logOutFunc();
      }
    });
  };

  const handleChangeInputs = (e) => {
    setUpdateContent({
      ...updateContent,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={!!updateDial} maxWidth="sm" fullWidth onClose={handleClose}>
      <DialogTitle className={styles.dialogHeader}>
        <span>{t("settings.update")}</span>
        <CloseIcon className={styles.dialogClose} onClick={handleClose} />
      </DialogTitle>
      <Divider />

      <DialogContent>
        <div className={styles.update}>
          <TextField
            sx={textFieldSx}
            inputProps={inputProps}
            autoComplete="off"
            name="firstName"
            value={updateContent?.firstName || ""}
            label={t("settings.name")}
            required
            error={submitAttempted && !updateContent?.firstName}
            onChange={handleChangeInputs}
          />

          <TextField
            sx={textFieldSx}
            inputProps={inputProps}
            autoComplete="off"
            name="lastName"
            value={updateContent?.lastName || ""}
            label={t("settings.surname")}
            onChange={handleChangeInputs}
          />

          <TextField
            sx={textFieldSx}
            inputProps={inputProps}
            autoComplete="off"
            name="userName"
            value={updateContent?.userName || ""}
            label={t("authorize.username")}
            required
            InputProps={{ readOnly: true }}
            onChange={handleChangeInputs}
          />

          <TextField
            sx={textFieldSx}
            inputProps={inputProps}
            autoComplete="off"
            name="email"
            value={updateContent?.email || ""}
            label={t("settings.email")}
            required
            error={submitAttempted && !updateContent?.email}
            onChange={handleChangeInputs}
          />

          <TextField
            sx={textFieldSx}
            inputProps={inputProps}
            autoComplete="new-password"
            name="password"
            type={seePass ? "text" : "password"}
            value={password}
            label={t("authorize.newpassword")}
            placeholder={t("settings.password")}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {seePass ? (
                    <VisibilityOffIcon
                      style={{ padding: 2, cursor: "pointer" }}
                      onClick={() => setSeePass(false)}
                    />
                  ) : (
                    <VisibilityIcon
                      style={{ padding: 2, cursor: "pointer" }}
                      onClick={() => setSeePass(true)}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <div className={styles.update_actions}>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ textTransform: "capitalize", background: "#bdbdbd" }}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateCashier}
              sx={{ textTransform: "capitalize", background: "#3FB68A" }}
            >
              {t("buttons.update")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(UpdateCashiers);
