import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Chip, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  applyLevelChange,
  flattenCategories,
  getCategories,
  normalizeCategoryTree,
  toCategoryIds
} from "../../../services/categories/categoriesRequests";

const CategoryLevelSelect = ({
  label,
  parent,
  options,
  visibleSelected,
  selectedIds,
  onChangeIds,
  error
}) => {
  const selected = options.filter((item) => visibleSelected.includes(item.id));

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={2}
      size="small"
      sx={{ width: "100%" }}
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

  const loadCategories = useCallback(async () => {
    const data = await getCategories();
    setTree(normalizeCategoryTree(data));
  }, [i18n.language]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
        error={error}
      />
      {selectedMains.length > 0 && (
        <CategoryLevelSelect
          label={subLabel}
          parent={subParent}
          options={subOptions}
          visibleSelected={visibleSelected}
          selectedIds={selectedIds}
          onChangeIds={onChange}
        />
      )}
    </Box>
  );
};

export default memo(ProductCategorySelect);
