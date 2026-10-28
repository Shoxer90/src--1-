import { memo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { toCategoryIconSrc } from "../../../services/categories/categoriesRequests";

export const MARKET_X_PHOTO_WIDTH = 800;
export const MARKET_X_PHOTO_HEIGHT = 600;

const releaseImageSource = (source) => {
  if (source && typeof source.close === "function") source.close();
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("read"));
  reader.readAsDataURL(file);
});

const loadImageSource = async (file) => {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      return createImageBitmap(file);
    }
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("image"));
      image.src = objectUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const cropImageToMarketX = (source) => {
  const width = source?.width || 0;
  const height = source?.height || 0;
  if (!width || !height) return "";
  const canvas = document.createElement("canvas");
  canvas.width = MARKET_X_PHOTO_WIDTH;
  canvas.height = MARKET_X_PHOTO_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const targetRatio = MARKET_X_PHOTO_WIDTH / MARKET_X_PHOTO_HEIGHT;
  const sourceRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = width;
  let sh = height;
  if (sourceRatio > targetRatio) {
    sw = height * targetRatio;
    sx = (width - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    sh = width / targetRatio;
    sy = (height - sh) / 2;
  }
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, MARKET_X_PHOTO_WIDTH, MARKET_X_PHOTO_HEIGHT);
  return canvas.toDataURL("image/jpeg", 0.92);
};

export const calcMarketXDiscountedPrice = (price, discount, type) => {
  const base = Number(price);
  const cut = Number(discount);
  if (!Number.isFinite(base)) return 0;
  const discountValue = Number.isFinite(cut) ? cut : 0;
  const result = `${type}` === "2"
    ? base - discountValue
    : base - (discountValue / 100) * base;
  return Math.round(Math.max(result, 0) * 100) / 100;
};

const toStringList = (value) => (
  Array.isArray(value) ? value.filter((item) => typeof item === "string" && item) : []
);

const photoUrl = (item) => {
  if (typeof item === "string") return item.trim();
  if (item && typeof item === "object") {
    const raw = item.url || item.Url || item.src || item.path || item.photo || item.Photo || "";
    return typeof raw === "string" ? raw.trim() : "";
  }
  return "";
};

export const toPhotoList = (product) => {
  const raw = Array.isArray(product) ? product : (product?.photos ?? product?.Photos);
  return (Array.isArray(raw) ? raw : []).map(photoUrl).filter(Boolean);
};

export const normalizeMarketXFields = (product) => {
  const marketXPrice = product?.marketXPrice ?? "";
  const marketXDiscount = product?.marketXDiscount ?? "";
  const marketXDiscountType = Number(product?.marketXDiscountType) || 0;
  return {
    photos: toPhotoList(product),
    externalResources: toStringList(product?.externalResources),
    nameHy: product?.nameHy || "",
    nameRu: product?.nameRu || "",
    nameEn: product?.nameEn || "",
    descriptionHy: product?.descriptionHy || "",
    descriptionRu: product?.descriptionRu || "",
    descriptionEn: product?.descriptionEn || "",
    marketXDiscount,
    marketXDiscountType,
    marketXPrice,
    marketXDiscountedPrice: product?.marketXPrice == null && product?.marketXDiscount == null
      ? (Number(product?.marketXDiscountedPrice) || 0)
      : calcMarketXDiscountedPrice(marketXPrice, marketXDiscount, marketXDiscountType),
  };
};

const keepMoney = (value) => {
  if (value === "") return "";
  return /^\d*\.?(?:\d{1,2})?$/.test(value) ? value : null;
};

const MarketXFields = ({ value, onChange, onWarn }) => {
  const { t } = useTranslation();
  const [linkDraft, setLinkDraft] = useState("");
  const [cropQueue, setCropQueue] = useState([]);
  const photos = toPhotoList(value);
  const links = value?.externalResources || [];
  const discountType = Number(value?.marketXDiscountType) || 0;
  const isPercent = `${discountType}` !== "2";

  const patch = (partial) => {
    onChange((prev) => {
      const next = { ...prev, ...partial };
      if (
        Object.prototype.hasOwnProperty.call(partial, "marketXPrice")
        || Object.prototype.hasOwnProperty.call(partial, "marketXDiscount")
        || Object.prototype.hasOwnProperty.call(partial, "marketXDiscountType")
      ) {
        next.marketXDiscountedPrice = calcMarketXDiscountedPrice(
          next.marketXPrice,
          next.marketXDiscount,
          next.marketXDiscountType
        );
      }
      return next;
    });
  };

  const handleMoney = (event) => {
    const text = keepMoney(event.target.value);
    if (text === null) return;
    if (event.target.name === "marketXDiscount" && isPercent && Number(text) > 100) return;
    patch({ [event.target.name]: text });
  };

  const appendPhotos = (sources) => {
    const nextPhotos = sources.filter(Boolean);
    if (!nextPhotos.length) return;
    onChange((prev) => ({
      ...prev,
      photos: [...(prev?.photos || []), ...nextPhotos],
    }));
  };

  const addPhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const exact = [];
    const cropped = [];
    for (const file of files) {
      if (file.type && !file.type.startsWith("image/")) {
        onWarn(t("dialogs.wrong"));
        continue;
      }
      let source;
      try {
        source = await loadImageSource(file);
        const { width, height } = source;
        if (width === MARKET_X_PHOTO_WIDTH && height === MARKET_X_PHOTO_HEIGHT) {
          exact.push(await readFileAsDataUrl(file));
          continue;
        }
        const src = cropImageToMarketX(source);
        if (!src) {
          onWarn(t("dialogs.wrong"));
          continue;
        }
        cropped.push({ src, width, height });
      } catch {
        onWarn(t("dialogs.wrong"));
      } finally {
        releaseImageSource(source);
      }
    }
    appendPhotos(exact);
    if (cropped.length) setCropQueue(cropped);
  };

  const confirmCroppedPhotos = () => {
    appendPhotos(cropQueue.map((item) => item.src));
    setCropQueue([]);
  };

  const addLink = () => {
    const raw = linkDraft.trim();
    if (!raw) return;
    let url = raw;
    try {
      const parsed = new URL(raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad");
      url = parsed.href;
    } catch {
      onWarn(t("productinputs.marketXLinkInvalid"));
      return;
    }
    if (links.includes(url)) {
      setLinkDraft("");
      return;
    }
    patch({ externalResources: [...links, url] });
    setLinkDraft("");
  };

  return (
    <Box sx={{
      width: "100%",
      mt: 1,
      mb: 1,
      p: 1.5,
      border: "1px solid #d9efe6",
      borderRadius: "10px",
      background: "#f7fbf9",
      display: "flex",
      flexDirection: "column",
      gap: 1.25,
    }}>
      <Box>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{t("productinputs.marketXPhotos")}</div>
        <div style={{
          marginBottom: 8,
          padding: "8px 10px",
          borderRadius: 8,
          background: "#fff7ed",
          color: "#9a3412",
          fontSize: 13,
          lineHeight: 1.45,
        }}>
          {t("productinputs.marketXPhotoSize")}
        </div>
        <Button component="label" variant="outlined" size="small" sx={{ textTransform: "capitalize" }}>
          {t("productinputs.marketXAddPhoto")}
          <input hidden type="file" accept="image/*" multiple onChange={addPhotos} />
        </Button>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {photos.map((src, index) => (
            <Box key={`${index}-${src}`} sx={{ position: "relative", width: 96, height: 72 }}>
              <img
                src={toCategoryIconSrc(src) || src}
                alt=""
                style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 6, background: "#fff" }}
              />
              <IconButton
                size="small"
                onClick={() => onChange((prev) => ({
                  ...prev,
                  photos: toPhotoList(prev).filter((_, photoIndex) => photoIndex !== index),
                }))}
                sx={{ position: "absolute", top: 0, right: 0, background: "rgba(255,255,255,0.9)" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      <TextField size="small" name="nameHy" value={value?.nameHy || ""} label={t("productinputs.marketXNameHy")} onChange={(e) => patch({ nameHy: e.target.value })} />
      <TextField size="small" name="nameRu" value={value?.nameRu || ""} label={t("productinputs.marketXNameRu")} onChange={(e) => patch({ nameRu: e.target.value })} />
      <TextField size="small" name="nameEn" value={value?.nameEn || ""} label={t("productinputs.marketXNameEn")} onChange={(e) => patch({ nameEn: e.target.value })} />
      <TextField size="small" multiline minRows={2} name="descriptionHy" value={value?.descriptionHy || ""} label={t("productinputs.marketXDescriptionHy")} onChange={(e) => patch({ descriptionHy: e.target.value })} />
      <TextField size="small" multiline minRows={2} name="descriptionRu" value={value?.descriptionRu || ""} label={t("productinputs.marketXDescriptionRu")} onChange={(e) => patch({ descriptionRu: e.target.value })} />
      <TextField size="small" multiline minRows={2} name="descriptionEn" value={value?.descriptionEn || ""} label={t("productinputs.marketXDescriptionEn")} onChange={(e) => patch({ descriptionEn: e.target.value })} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
        <TextField
          size="small"
          name="marketXPrice"
          value={value?.marketXPrice ?? ""}
          label={t("productinputs.marketXPrice")}
          onChange={handleMoney}
        />
        <FormControl size="small">
          <InputLabel>{t("productinputs.marketXDiscountType")}</InputLabel>
          <Select
            value={isPercent ? 0 : 2}
            label={t("productinputs.marketXDiscountType")}
            onChange={(e) => patch({ marketXDiscountType: Number(e.target.value) })}
          >
            <MenuItem value={0}>{t("productinputs.marketXDiscountPercent")}</MenuItem>
            <MenuItem value={2}>{t("productinputs.marketXDiscountFixed")}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          name="marketXDiscount"
          value={value?.marketXDiscount ?? ""}
          label={t("productinputs.marketXDiscount")}
          onChange={handleMoney}
        />
        <TextField
          size="small"
          value={calcMarketXDiscountedPrice(value?.marketXPrice, value?.marketXDiscount, discountType)}
          label={t("productinputs.marketXDiscountedPrice")}
          InputProps={{ readOnly: true }}
        />
      </Box>
      <Box>
        <div style={{ fontWeight: 600 }}>{t("productinputs.marketXLinks")}</div>
        <div style={{ color: "#4b5563", fontSize: 13, margin: "4px 0 8px" }}>
          {t("productinputs.marketXLinkHint")}
        </div>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={linkDraft}
            placeholder="https://"
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
          />
          <Button variant="contained" onClick={addLink} sx={{ textTransform: "capitalize", background: "#3FB68A", whiteSpace: "nowrap" }}>
            {t("productinputs.marketXAddLink")}
          </Button>
        </Box>
        {links.map((link, index) => (
          <Box key={link} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <a href={link} target="_blank" rel="noreferrer" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {link}
            </a>
            <IconButton
              size="small"
              onClick={() => patch({ externalResources: links.filter((_, linkIndex) => linkIndex !== index) })}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Dialog open={cropQueue.length > 0} onClose={() => setCropQueue([])} maxWidth="sm" fullWidth>
        <DialogTitle>{t("productinputs.marketXPhotoCropTitle")}</DialogTitle>
        <DialogContent>
          <div style={{
            marginBottom: 12,
            padding: "8px 10px",
            borderRadius: 8,
            background: "#fff7ed",
            color: "#9a3412",
            fontSize: 14,
            lineHeight: 1.45,
          }}>
            {t("productinputs.marketXPhotoSizeError")}
          </div>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {cropQueue.map((item) => (
              <Box key={item.src} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                <img
                  src={item.src}
                  alt=""
                  style={{ width: "100%", maxWidth: 400, height: "auto", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <span style={{ color: "#6b7280", fontSize: 12 }}>
                  {t("productinputs.marketXPhotoOriginal", { width: item.width, height: item.height })}
                </span>
                <span style={{ color: "#374151", fontSize: 12, fontWeight: 600 }}>
                  {t("productinputs.marketXPhotoResult")}
                </span>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCropQueue([])} sx={{ textTransform: "capitalize" }}>
            {t("buttons.cancel")}
          </Button>
          <Button variant="contained" onClick={confirmCroppedPhotos} sx={{ textTransform: "capitalize", background: "#3FB68A" }}>
            {t("buttons.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default memo(MarketXFields);
