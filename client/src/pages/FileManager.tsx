import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Upload,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Trash2,
  Download,
  Edit2,
  Search,
  FolderOpen,
  CloudUpload,
} from "lucide-react";

const CATEGORIES = [
  { value: "general", label: "ทั่วไป" },
  { value: "report", label: "รายงาน" },
  { value: "data", label: "ข้อมูล" },
  { value: "image", label: "รูปภาพ" },
  { value: "document", label: "เอกสาร" },
  { value: "other", label: "อื่นๆ" },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-slate-100 text-slate-700",
  report: "bg-blue-100 text-blue-700",
  data: "bg-green-100 text-green-700",
  image: "bg-purple-100 text-purple-700",
  document: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage className="w-5 h-5 text-purple-500" />;
  if (mimeType.startsWith("video/")) return <FileVideo className="w-5 h-5 text-red-500" />;
  if (mimeType.startsWith("audio/")) return <FileAudio className="w-5 h-5 text-pink-500" />;
  if (mimeType === "application/pdf") return <FileText className="w-5 h-5 text-red-600" />;
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("gzip"))
    return <Archive className="w-5 h-5 text-yellow-600" />;
  if (mimeType.startsWith("text/") || mimeType.includes("document"))
    return <FileText className="w-5 h-5 text-blue-500" />;
  return <File className="w-5 h-5 text-slate-500" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FileManager() {
  const utils = trpc.useUtils();
  const { data: files = [], isLoading } = trpc.files.list.useQuery();

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [uploadDescription, setUploadDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search/filter state
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Edit dialog state
  const [editFile, setEditFile] = useState<{ id: number; description: string; category: string } | null>(null);

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const updateMutation = trpc.files.update.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      setEditFile(null);
      toast.success("อัปเดตข้อมูลไฟล์สำเร็จ");
    },
    onError: (err) => toast.error(`เกิดข้อผิดพลาด: ${err.message}`),
  });

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      setDeleteId(null);
      toast.success("ลบไฟล์สำเร็จ");
    },
    onError: (err) => toast.error(`เกิดข้อผิดพลาด: ${err.message}`),
  });

  const handleUpload = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setUploading(true);
      let successCount = 0;
      let failCount = 0;

      for (const file of Array.from(fileList)) {
        if (file.size > 16 * 1024 * 1024) {
          toast.error(`${file.name}: ไฟล์ใหญ่เกิน 16 MB`);
          failCount++;
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", uploadCategory);
        formData.append("description", uploadDescription);

        try {
          const resp = await fetch("/api/files/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(err.error || "Upload failed");
          }
          successCount++;
        } catch (err: any) {
          toast.error(`${file.name}: ${err.message}`);
          failCount++;
        }
      }

      setUploading(false);
      if (successCount > 0) {
        toast.success(`อัปโหลดสำเร็จ ${successCount} ไฟล์`);
        utils.files.list.invalidate();
        setUploadDescription("");
      }
    },
    [uploadCategory, uploadDescription, utils]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const filteredFiles = files.filter((f) => {
    const matchSearch =
      search === "" ||
      f.filename.toLowerCase().includes(search.toLowerCase()) ||
      (f.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || f.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-blue-600" />
            จัดการไฟล์
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            อัปโหลด จัดเก็บ และจัดการไฟล์ของคุณ (สูงสุด 16 MB ต่อไฟล์)
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {files.length} ไฟล์ทั้งหมด
        </Badge>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed transition-colors duration-200"
        style={{ borderColor: isDragging ? "#3b82f6" : undefined }}>
        <CardContent className="p-6">
          <div
            className={`rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragging ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
            <p className="text-base font-medium text-gray-700">
              {isDragging ? "วางไฟล์ที่นี่" : "ลากไฟล์มาวางหรือคลิกเพื่อเลือก"}
            </p>
            <p className="text-sm text-gray-400 mt-1">รองรับทุกประเภทไฟล์ ขนาดสูงสุด 16 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>

          {/* Upload options */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">หมวดหมู่</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">หมายเหตุ (ไม่บังคับ)</Label>
              <Input
                placeholder="คำอธิบายไฟล์..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
          </div>

          {uploading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              กำลังอัปโหลด...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="ค้นหาไฟล์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="หมวดหมู่ทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <File className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              {files.length === 0 ? "ยังไม่มีไฟล์" : "ไม่พบไฟล์ที่ค้นหา"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {files.length === 0 ? "อัปโหลดไฟล์แรกของคุณด้านบน" : "ลองเปลี่ยนคำค้นหา"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow duration-150">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 truncate max-w-xs">
                        {file.filename}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[file.category] ?? CATEGORY_COLORS.general}`}>
                        {CATEGORIES.find((c) => c.value === file.category)?.label ?? file.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span>{formatBytes(file.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                      {file.description && (
                        <>
                          <span>•</span>
                          <span className="italic truncate max-w-xs">{file.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600"
                      onClick={() => window.open(file.storageUrl, "_blank")}
                      title="ดาวน์โหลด"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-amber-600"
                      onClick={() =>
                        setEditFile({
                          id: file.id,
                          description: file.description ?? "",
                          category: file.category,
                        })
                      }
                      title="แก้ไข"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => setDeleteId(file.id)}
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editFile !== null} onOpenChange={(open) => !open && setEditFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลไฟล์</DialogTitle>
          </DialogHeader>
          {editFile && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>หมวดหมู่</Label>
                <Select
                  value={editFile.category}
                  onValueChange={(v) => setEditFile({ ...editFile, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>คำอธิบาย</Label>
                <Input
                  value={editFile.description}
                  onChange={(e) => setEditFile({ ...editFile, description: e.target.value })}
                  placeholder="คำอธิบายไฟล์..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFile(null)}>ยกเลิก</Button>
            <Button
              onClick={() => {
                if (!editFile) return;
                updateMutation.mutate({
                  id: editFile.id,
                  description: editFile.description,
                  category: editFile.category,
                });
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบไฟล์</AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้ไม่สามารถย้อนกลับได้ ไฟล์จะถูกลบออกจากระบบถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId !== null) deleteMutation.mutate({ id: deleteId });
              }}
            >
              ลบไฟล์
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
