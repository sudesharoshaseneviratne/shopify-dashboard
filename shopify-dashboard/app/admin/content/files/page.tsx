"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Search,
  Columns,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Upload,
  Globe,
  Loader2,
  Check,
  X,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { 
  getAdminFilesAction, 
  uploadFilesAction, 
  uploadFileFromUrlAction, 
  deleteFileAction, 
  bulkDeleteFilesAction,
  type AdminFileItem 
} from "@/app/actions/files";

export default function FilesPage() {
  const [files, setFiles] = useState<AdminFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Table sorting & selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<"name" | "date" | "size">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Modal states
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch files from database
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminFilesAction();
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Filtered and sorted files
  const filteredFiles = useMemo(() => {
    let result = [...files];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q) ||
          f.url.toLowerCase().includes(q) ||
          f.referencesSummary.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortColumn === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortColumn === "size") {
        return sortDirection === "asc" ? a.size - b.size : b.size - a.size;
      }
      if (sortColumn === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [files, searchQuery, sortColumn, sortDirection]);

  // Handle Sort
  const handleSort = (colKey: "name" | "date" | "size") => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("desc");
    }
  };

  const renderSortIndicator = (colKey: "name" | "date" | "size") => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  // Selection
  const isAllSelected = filteredFiles.length > 0 && selectedIds.size === filteredFiles.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFiles.map((f) => f.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Handle Native File Upload
  const handleNativeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const formData = new FormData();
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("files", uploadedFiles[i]);
      }

      const res = await uploadFilesAction(formData);
      if (res.success && res.files) {
        await loadFiles();
      } else {
        setUploadError(res.error || "Failed to upload files");
      }
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle Upload From URL
  const handleUrlUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await uploadFileFromUrlAction(urlInput.trim(), nameInput.trim() || undefined);
      if (res.success && res.file) {
        setIsUrlModalOpen(false);
        setUrlInput("");
        setNameInput("");
        await loadFiles();
      } else {
        setUploadError(res.error || "Failed to add file from URL");
      }
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Copy URL
  const handleCopyUrl = (file: AdminFileItem) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Single Delete
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await deleteFileAction(id);
      if (res.success) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      setIsDeleting(true);
      const idsToDelete = Array.from(selectedIds);
      const res = await bulkDeleteFilesAction(idsToDelete);
      if (res.success) {
        setFiles((prev) => prev.filter((f) => !selectedIds.has(f.id)));
        setSelectedIds(new Set());
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date helper
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="w-full font-sans space-y-4 pb-16">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleNativeUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#616161]" />
            <span>Files</span>
          </h1>
          <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {files.length} {files.length === 1 ? "file" : "files"} in database
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(true)}
            className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-[#616161]" />
            <span>Upload from URL</span>
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-1.5 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] disabled:opacity-50 rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? "Uploading..." : "Upload files"}</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-red-600 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Table Area */}
      <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-[#e1e3e5] bg-white gap-3">
          <div className="flex items-center gap-2 flex-1">
            {selectedIds.size > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#1a1a1a] px-3 py-1 bg-[#f1f2f4] rounded-lg">
                  {selectedIds.size} selected
                </span>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-[13px] font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete selected</span>
                </button>
              </div>
            ) : (
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#616161] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search and filter files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[13px] bg-[#f9fafb] border border-[#e1e3e5] focus:border-[#005bd3] focus:bg-white rounded-xl pl-9 pr-3.5 py-1.5 outline-none transition"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#616161] text-[12px] font-medium">
            <span>
              Showing {filteredFiles.length} of {files.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#616161] animate-spin" />
              <p className="text-[13px] text-[#616161] font-medium">Loading files from database...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f1f2f4] flex items-center justify-center mx-auto text-[#616161]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">
                {searchQuery ? "No matching files found" : "No files stored in database yet"}
              </h3>
              <p className="text-[13px] text-[#616161] max-w-sm mx-auto">
                {searchQuery
                  ? "Try searching with a different file name or extension."
                  : "Files uploaded to products or collections will automatically appear here."}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-xl transition shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload your first file</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left whitespace-nowrap border-collapse">
              <thead>
                <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#fafafa] select-none h-[38px]">
                  <th className="py-2 px-3 w-10 align-middle">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-[#c9cccf] cursor-pointer"
                    />
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer hover:text-[#1a1a1a] transition align-middle"
                    onClick={() => handleSort("name")}
                  >
                    File name {renderSortIndicator("name")}
                  </th>
                  <th className="py-2 px-3 align-middle">Alt text</th>
                  <th
                    className="py-2 px-3 cursor-pointer hover:text-[#1a1a1a] transition align-middle"
                    onClick={() => handleSort("date")}
                  >
                    Date added {renderSortIndicator("date")}
                  </th>
                  <th
                    className="py-2 px-3 text-right cursor-pointer hover:text-[#1a1a1a] transition align-middle"
                    onClick={() => handleSort("size")}
                  >
                    Size {renderSortIndicator("size")}
                  </th>
                  <th className="py-2 px-3 align-middle">References</th>
                  <th className="py-2 px-3 text-right w-24 align-middle">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f1]">
                {filteredFiles.map((f) => {
                  const isSelected = selectedIds.has(f.id);
                  return (
                    <tr
                      key={f.id}
                      className={`h-[42px] transition group ${
                        isSelected ? "bg-[#f4f6f8]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <td className="py-1.5 px-3 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(f.id)}
                          className="rounded border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      <td className="py-1.5 px-3 font-medium text-[#1a1a1a] align-middle">
                        <div className="flex items-center gap-2.5">
                          {/* Live Image Thumbnail Preview */}
                          <div className="w-7 h-7 rounded-md border border-[#e1e3e5] bg-[#f9fafb] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {f.url ? (
                              <img
                                src={f.url}
                                alt={f.altText || f.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback icon on broken image
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-[#8c8c8c]" />
                            )}
                          </div>
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="truncate max-w-[260px] sm:max-w-[340px] text-[13px] font-semibold text-[#1a1a1a]">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-[#8c8c8c] uppercase font-mono shrink-0">
                              .{f.extension.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-3 text-[12px] text-[#616161] align-middle">
                        {f.altText || <span className="text-[#a1a1a1] italic">—</span>}
                      </td>
                      <td className="py-1.5 px-3 text-[12px] text-[#1a1a1a] align-middle">
                        {formatDate(f.createdAt)}
                      </td>
                      <td className="py-1.5 px-3 text-[12px] text-[#1a1a1a] text-right font-mono align-middle">
                        {f.sizeFormatted}
                      </td>
                      <td className="py-1.5 px-3 text-[12px] text-[#1a1a1a] align-middle">
                        {f.referencesCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-semibold">
                            {f.referencesSummary}
                          </span>
                        ) : (
                          <span className="text-[#8c8c8c] text-[11px]">0 references</span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1">
                          {/* Copy URL button */}
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(f)}
                            className="p-1 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] rounded-md transition cursor-pointer"
                            title="Copy image URL"
                          >
                            {copiedId === f.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <LinkIcon className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Open in new tab */}
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] rounded-md transition cursor-pointer"
                            title="Open original file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete single button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(f.id)}
                            className="p-1 text-[#616161] hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload From URL Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-[#1a1a1a] border border-[#e1e3e5] animate-in zoom-in-95 duration-150">
            <form onSubmit={handleUrlUpload}>
              <div className="px-6 py-4 border-b border-[#e1e3e5] flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Upload file from URL</h2>
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-semibold text-[#303030]">File URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full text-[13px] border border-[#c9cccf] focus:border-[#005bd3] rounded-xl px-3.5 py-2 outline-none bg-white text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12.5px] font-semibold text-[#303030]">File Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. cold-storage-vault"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full text-[13px] border border-[#c9cccf] focus:border-[#005bd3] rounded-xl px-3.5 py-2 outline-none bg-white text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div className="px-6 py-3.5 border-t border-[#e1e3e5] bg-[#fafafa] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !urlInput.trim()}
                  className="px-4 py-1.5 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] disabled:opacity-50 rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? "Uploading..." : "Add file"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
