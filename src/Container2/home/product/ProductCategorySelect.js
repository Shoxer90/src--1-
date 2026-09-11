import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import {
  applyLevelChange,
  collectDescendantIds,
  createCategory,
  extractCategoryId,
  flattenCategories,
  getCategories,
  getCategoryTitle,
  normalizeCategoryTree,
  toCategoryIds,
  updateCategory
} from "../../../services/categories/categoriesRequests";
import SnackErr from "../../dialogs/SnackErr";

const emptyForm = {
  titleHy: "",
  titleEn: "",
  titleRu: "",
  parentCategoryId: null
};

const CategoryLevelSelect = ({
  label,
  parent,
  options,
  visibleSelected,
  selectedIds,
  onChangeIds,
  onOpenCreate,
  onOpenEdit,
  error,
  t
}) => {
  const selected = options.filter((item) => visibleSelected.includes(item.id));
  const lastSelected = selected[selected.length - 1];

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 0.5 }}>
      <Autocomplete
        multiple
        filterSelectedOptions
        limitTags={2}
        size="small"
        sx={{ flex: 1, minWidth: 0 }}
        options={options}
        value={selected}
        onChange={(_, next) => {
          const items = Array.isArray(next) ? next : [];
          onChangeIds(applyLevelChange(selectedIds, parent, items));
        }}
        getOptionLabel={(option) => option.title || ""}
        isOptionEqualToValue={(option, current) => option?.id === current?.id}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key || option.id}
                size="small"
                label={option.title}
                title={option.pathLabel}
                {...tagProps}
              />
            );
          })
        }
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key || option.id} {...optionProps}>
              {option.title}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!error}
            label={label}
            placeholder=""
            autoComplete="off"
            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
          />
        )}
        noOptionsText=" "
      />
      <IconButton
        size="small"
        sx={{ mt: 0.5 }}
        title={t("productinputs.addCategory")}
        onClick={() => onOpenCreate("", parent?.id ?? null)}
      >
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={{ mt: 0.5 }}
        title={t("productinputs.editCategory")}
        disabled={!lastSelected}
        onClick={() => onOpenEdit(lastSelected)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const ProductCategorySelect = ({
  value,
  onChange,
  error,
  width = "100%"
}) => {
  const { t, i18n } = useTranslation();
  const [tree, setTree] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState({ message: "", type: "" });

  const selectedIds = useMemo(() => toCategoryIds(value), [value]);
  const flatOptions = useMemo(() => flattenCategories(tree), [tree]);
  const byId = useMemo(() => {
    const map = {};
    flatOptions.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [flatOptions]);

  const visibleSelected = useMemo(() => {
    const set = new Set(selectedIds);
    selectedIds.forEach((id) => {
      let parentId = byId[id]?.parentId;
      while (parentId) {
        set.add(parentId);
        parentId = byId[parentId]?.parentId;
      }
    });
    return [...set];
  }, [selectedIds, byId]);

  const parentOptions = useMemo(() => {
    if (!editingId) return flatOptions;
    const excluded = new Set([editingId, ...collectDescendantIds(byId[editingId])]);
    return flatOptions.filter((item) => !excluded.has(item.id));
  }, [flatOptions, editingId, byId]);

  const loadCategories = useCallback(async (force = false) => {
    const data = await getCategories(force);
    const nextTree = normalizeCategoryTree(data);
    setTree(nextTree);
    return flattenCategories(nextTree);
  }, [i18n.language]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = (title = "", parentCategoryId = null) => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      titleHy: title,
      titleEn: title,
      titleRu: title,
      parentCategoryId
    });
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
      parentCategoryId: item.parentId
    });
    setFormError("");
    setOpenForm(true);
  };

  const closeForm = (event) => {
    event?.stopPropagation?.();
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

  const findCreated = (list, titles, parentId) => {
    const names = [titles.titleHy, titles.titleEn, titles.titleRu]
      .filter(Boolean)
      .map((item) => item.trim().toLowerCase());
    const matches = list.filter((item) => {
      const sameParent = (item.parentId || null) === (parentId || null);
      const title = (item.title || getCategoryTitle(item)).trim().toLowerCase();
      return sameParent && names.includes(title);
    });
    if (!matches.length) return null;
    return matches.reduce((max, item) => (item.id > max.id ? item : max));
  };

  const saveCategory = async (event) => {
    event?.stopPropagation?.();
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
      discountType: current?.discountType ?? 0
    };
    const result = editingId
      ? await updateCategory(editingId, body)
      : await createCategory(body);
    setSaving(false);
    if (!result?.ok) {
      setFormError(t("dialogs.wrong"));
      return;
    }
    const list = await loadCategories(true);
    const createdId = extractCategoryId(result.data) || findCreated(list, titles, form.parentCategoryId)?.id;
    if (createdId && !editingId) {
      const next = selectedIds.includes(createdId) ? selectedIds : [...selectedIds, createdId];
      const parentId = form.parentCategoryId;
      onChange(parentId && !next.includes(parentId) ? [...next, parentId] : next);
    }
    setMessage({
      message: editingId ? t("productinputs.categoryUpdated") : t("productinputs.categoryAdded"),
      type: "success"
    });
    closeForm();
  };

  const rootParent = useMemo(() => ({ id: null, children: tree }), [tree]);
  const selectedMains = useMemo(
    () => tree.filter((item) => visibleSelected.includes(item.id)),
    [tree, visibleSelected]
  );
  const subOptions = useMemo(
    () => selectedMains.flatMap((item) => item.children || []),
    [selectedMains]
  );
  const subParent = useMemo(
    () => ({
      id: selectedMains.length === 1 ? selectedMains[0].id : null,
      children: subOptions
    }),
    [selectedMains, subOptions]
  );
  const subLabel = selectedMains.length === 1
    ? t("productinputs.subCategoriesOf", { name: selectedMains[0].title })
    : t("productinputs.subCategory");

  return (
    <Box sx={{ width, display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start", alignSelf: "center" }}>
      <CategoryLevelSelect
        label={t("productinputs.category")}
        parent={rootParent}
        options={tree}
        visibleSelected={visibleSelected}
        selectedIds={selectedIds}
        onChangeIds={onChange}
        onOpenCreate={openCreate}
        onOpenEdit={openEdit}
        error={error}
        t={t}
      />
      {selectedMains.length > 0 && (
        <CategoryLevelSelect
          label={subLabel}
          parent={subParent}
          options={subOptions}
          visibleSelected={visibleSelected}
          selectedIds={selectedIds}
          onChangeIds={onChange}
          onOpenCreate={(title, parentCategoryId) =>
            openCreate(title, parentCategoryId || selectedMains[selectedMains.length - 1]?.id || null)
          }
          onOpenEdit={openEdit}
          t={t}
        />
      )}

      <Dialog
        open={openForm}
        onClose={closeForm}
        onClick={(event) => event.stopPropagation()}
        fullWidth
        maxWidth="xs"
      >
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
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            pt: 2
          }}
        >
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
          {!!form.parentCategoryId && (
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
          )}
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

      <Dialog open={!!message.message}>
        <SnackErr
          type={message.type}
          message={message.message}
          close={() => setMessage({ message: "", type: "" })}
        />
      </Dialog>
    </Box>
  );
};

export default memo(ProductCategorySelect);
