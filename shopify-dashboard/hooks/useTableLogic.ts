"use client";

import { useState, useMemo, MouseEvent } from "react";

export function useTableLogic<T extends Record<string, any>>(
  initialData: T[],
  idKey: keyof T = "id"
) {
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sorted Data Calculation
  const sortedData = useMemo(() => {
    if (!sortColumn) return initialData;

    return [...initialData].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (valA == null) return 1;
      if (valB == null) return -1;

      // Handle currency strings like "Rs 2,060.00"
      if (typeof valA === "string" && (valA.includes("Rs ") || valA.includes("LKR"))) {
        valA = parseFloat(valA.replace(/[^0-9.]/g, "")) || 0;
        valB = parseFloat(valB.replace(/[^0-9.]/g, "")) || 0;
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [initialData, sortColumn, sortDirection]);

  // Handle Header Column Click for Sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Select All Header Checkbox Toggle
  const isAllSelected =
    sortedData.length > 0 && selectedIds.size === sortedData.length;
  const isSomeSelected =
    selectedIds.size > 0 && selectedIds.size < sortedData.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(sortedData.map((item) => item[idKey]));
      setSelectedIds(allIds);
    }
  };

  // Row Checkbox Click with Ctrl/Shift logic
  const handleRowCheckboxClick = (
    e: MouseEvent<HTMLInputElement>,
    index: number,
    id: any
  ) => {
    const newSelected = new Set(selectedIds);

    if (e.shiftKey && lastClickedIndex !== null) {
      // Shift + Click Range Selection
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);

      for (let i = start; i <= end; i++) {
        newSelected.add(sortedData[i][idKey]);
      }
    } else {
      // Single Click or Ctrl/Cmd Click
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    }

    setLastClickedIndex(index);
    setSelectedIds(newSelected);
  };

  const isRowSelected = (id: any) => selectedIds.has(id);

  return {
    sortedData,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    isSomeSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  };
}
