import { memo, useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import { getStoreCategories, toStoreCategoryIconSrc } from "../../../../services/categories/categoriesRequests";
import { activateMarketX } from "../../../../services/auth/auth";

const ActivateMarketXDialog = ({ open, close, onConfirm, setMessage }) => {
  const { t } = useTranslation();
  const [activityType, setActivityType] = useState("");
  const [categories, setCategories] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasActivityType = activityType !== "";

  const resetAndClose = () => {
    setActivityType("");
    setOpenConfirm(false);
    close();
  };

  const handleActivate = () => {
    if (!hasActivityType) return;
    setOpenConfirm(true);
  };

  const confirmActivation = async () => {
    if (loading) return;
    setLoading(true);
    const res = await activateMarketX(Number(activityType));
    setLoading(false);
    setOpenConfirm(false);
    if (res?.status === 200) {
      onConfirm(activityType);
      setActivityType("");
      return;
    }
    setMessage?.({
      message: res?.data?.message || t("dialogs.wrong"),
      type: "error",
    });
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getStoreCategories().then((res) => {
      if (!cancelled) {
        setCategories(Array.isArray(res) ? res : []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const selectedCategory = categories.find((item) => item.id === activityType)
    || categories.find((item) => item.id === Number(activityType));

  const renderCategoryOption = (item) => {
    const iconSrc = toStoreCategoryIconSrc(item);
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            style={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0 }}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        ) : null}
        <span>{item?.title}</span>
      </Box>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={resetAndClose}>
        <DialogContent sx={{ minWidth: 360 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h6 style={{ margin: 0 }}>{t("settings.MarketX")}</h6>
            <IconButton onClick={resetAndClose} style={{ color: "gray" }}>
              <CloseIcon />
            </IconButton>
          </div>
          <Divider sx={{ m: 1 }} color="black" />
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>{t("settings.activityType")}</InputLabel>
            <Select
              value={activityType}
              label={t("settings.activityType")}
              onChange={(e) => setActivityType(e.target.value)}
              renderValue={() => selectedCategory ? renderCategoryOption(selectedCategory) : ""}
            >
              {categories.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {renderCategoryOption(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={!hasActivityType}
            onClick={handleActivate}
            sx={{
              mt: 2,
              width: "100%",
              background: "#3FB68A",
              textTransform: "capitalize",
            }}
          >
            {t("settings.activate")}
          </Button>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openConfirm}
        close={setOpenConfirm}
        func={confirmActivation}
        title=""
        question={t("settings.activateMarketXConfirm")}
        content=" "
        t={t}
      />
    </>
  );
};

export default memo(ActivateMarketXDialog);
