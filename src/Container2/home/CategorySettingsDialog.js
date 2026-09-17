import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useTranslation } from "react-i18next";
import {
  collectDescendantIds,
  createCategory,
  deleteCategory,
  flattenCategories,
  getCategories,
  mapCategoriesById,
  normalizeCategoryTree,
  toCategoryIconSrc,
  updateCategory
} from "../../services/categories/categoriesRequests";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import SnackErr from "../dialogs/SnackErr";

const emptyForm = {
  titleHy: "",
  titleEn: "",
  titleRu: "",
  parentCategoryId: null,
  icon: ""
};

const fileToIcon = (file) => new Promise((resolve) => {
  if (!file) {
    resolve("");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 96;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(reader.result || "");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const CategorySettingsDialog = ({ open, onClose, onChanged }) => {
  const { t, i18n } = useTranslation();
  const [tree, setTree] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;

  const flatOptions = useMemo(() => flattenCategories(tree), [tree]);
  const byId = useMemo(() => mapCategoriesById(tree), [tree]);

  const parentOptions = useMemo(() => {
    if (!editingId) return flatOptions;
    const excluded = new Set([editingId, ...collectDescendantIds(byId[editingId])]);
    return flatOptions.filter((item) => !excluded.has(item.id));
  }, [flatOptions, editingId, byId]);

  const loadCategories = useCallback(async (force = false, notify = false) => {
    const data = await getCategories(force);
    const nextTree = normalizeCategoryTree(data);
    setTree(nextTree);
    if (notify) onChangedRef.current?.(nextTree);
    return nextTree;
  }, [i18n.language]);

  useEffect(() => {
    if (open) loadCategories(true);
  }, [open, loadCategories]);

  const openCreate = (parentCategoryId = null) => {
    setEditingId(null);
    setForm({ ...emptyForm, parentCategoryId });
    setFormError("");
    setOpenForm(true);
  };

  const openEdit = (item) => {
    if (!item) return;
    setEditingId(item.id);
    setForm({
      titleHy: item.titleHy || "",
      titleEn: item.titleEn || "",
      titleRu: item.titleRu || "",
      parentCategoryId: item.parentId,
      icon: item.icon || ""
    });
    setFormError("");
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const fillEmptyTitles = (current) => {
    const filled = current.titleHy || current.titleEn || current.titleRu;
    return {
      titleHy: current.titleHy || filled,
      titleEn: current.titleEn || filled,
      titleRu: current.titleRu || filled
    };
  };

  const saveCategory = async () => {
    const titles = fillEmptyTitles(form);
    if (!titles.titleHy && !titles.titleEn && !titles.titleRu) {
      setFormError(t("authorize.errors.emptyfield"));
      return;
    }
    setSaving(true);
    const current = byId[editingId];
    const body = {
      id: editingId || 0,
      titleHy: titles.titleHy,
      titleEn: titles.titleEn,
      titleRu: titles.titleRu,
      parentCategoryId: form.parentCategoryId || null,
      discount: current?.discount ?? 0,
      discountType: current?.discountType ?? 0,
      icon: form.icon || ""
    };
    const result = editingId
      ? await updateCategory(editingId, body)
      : await createCategory(body);
    setSaving(false);
    if (!result?.ok) {
      setFormError(t("dialogs.wrong"));
      return;
    }
    await loadCategories(true, true);
    setMessage({
      message: editingId ? t("productinputs.categoryUpdated") : t("productinputs.categoryAdded"),
      type: "success"
    });
    closeForm();
  };

  const confirmDelete = async () => {
    const id = deleteId;
    setDeleteId(null);
    if (!id) return;
    const result = await deleteCategory(id);
    if (!result?.ok) {
      setMessage({ message: t("dialogs.wrong"), type: "error" });
      return;
    }
    await loadCategories(true, true);
    setMessage({ message: t("productinputs.categoryDeleted"), type: "success" });
  };

  const renderRow = (item, nested = false) => (
    <Box
      key={item.id}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.5,
        pl: nested ? 3 : 0,
        borderBottom: "1px solid #eee"
      }}
    >
      {toCategoryIconSrc(item.icon) ? (
        <img
          src={toCategoryIconSrc(item.icon)}
          alt=""
          style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
        />
      ) : (
        <Box sx={{ width: 28, height: 28, borderRadius: 1, background: "#eee", flexShrink: 0 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0, fontWeight: nested ? 400 : 600 }}>
        {item.title}
      </Box>
      {!nested && (
        <IconButton size="small" title={t("productinputs.addSubCategory")} onClick={() => openCreate(item.id)}>
          <AddIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton size="small" title={t("productinputs.editCategory")} onClick={() => openEdit(item)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" title={t("buttons.remove")} onClick={() => setDeleteId(item.id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px"
          }}
        >
          <span>{t("productinputs.categorySettings")}</span>
          <CloseIcon
            sx={{ ":hover": { background: "#d6d3d3", borderRadius: "5px" } }}
            onClick={onClose}
          />
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            style={{ backgroundColor: "#FFA500", textTransform: "capitalize", alignSelf: "flex-start" }}
            onClick={() => openCreate(null)}
          >
            {t("productinputs.addCategory")}
          </Button>
          {tree.map((item) => (
            <Box key={item.id}>
              {renderRow(item)}
              {(item.children || []).map((child) => renderRow(child, true))}
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="xs">
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px"
          }}
        >
          <span>{editingId ? t("productinputs.editCategory") : t("productinputs.addCategory")}</span>
          <CloseIcon
            sx={{ ":hover": { background: "#d6d3d3", borderRadius: "5px" } }}
            onClick={closeForm}
          />
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                overflow: "hidden",
                background: "#f2f2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {toCategoryIconSrc(form.icon) ? (
                <img src={toCategoryIconSrc(form.icon)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <AddAPhotoIcon sx={{ color: "#888" }} />
              )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Button
                size="small"
                component="label"
                variant="outlined"
                style={{ textTransform: "capitalize" }}
              >
                {t("productinputs.categoryIcon")}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    const icon = await fileToIcon(file);
                    setForm((prev) => ({ ...prev, icon }));
                    event.target.value = "";
                  }}
                />
              </Button>
              {!!form.icon && (
                <Button
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  onClick={() => setForm((prev) => ({ ...prev, icon: "" }))}
                >
                  {t("buttons.remove")}
                </Button>
              )}
            </Box>
          </Box>
          <TextField
            size="small"
            autoComplete="off"
            label={t("productinputs.titleHy")}
            value={form.titleHy}
            onChange={(e) => setForm({ ...form, titleHy: e.target.value })}
          />
          <TextField
            size="small"
            autoComplete="off"
            label={t("productinputs.titleEn")}
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
          />
          <TextField
            size="small"
            autoComplete="off"
            label={t("productinputs.titleRu")}
            value={form.titleRu}
            onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
          />
          <Autocomplete
            size="small"
            options={parentOptions}
            value={parentOptions.find((item) => item.id === form.parentCategoryId) || null}
            onChange={(_, next) => setForm({ ...form, parentCategoryId: next?.id || null })}
            getOptionLabel={(option) => option.pathLabel || option.title || ""}
            isOptionEqualToValue={(option, current) => option?.id === current?.id}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key || option.id} {...optionProps}>
                  <span style={{ paddingLeft: (option.depth || 0) * 12 }}>{option.title}</span>
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("productinputs.parentCategory")}
                autoComplete="off"
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
              />
            )}
          />
          {formError && (
            <div style={{ color: "red", fontSize: "80%" }}>{formError}</div>
          )}
          <Button
            variant="contained"
            disabled={saving}
            style={{ backgroundColor: "#FFA500", textTransform: "capitalize" }}
            onClick={saveCategory}
          >
            {editingId ? t("buttons.save") : t("buttons.create")}
          </Button>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        close={() => setDeleteId(null)}
        func={confirmDelete}
        title={t("buttons.remove")}
        question={t("productinputs.confirmDeleteCategory")}
        content={byId[deleteId]?.title}
      />

      <Dialog open={!!message.message}>
        <SnackErr
          type={message.type}
          message={message.message}
          close={() => setMessage({ message: "", type: "" })}
        />
      </Dialog>
    </>
  );
};

export default memo(CategorySettingsDialog);
