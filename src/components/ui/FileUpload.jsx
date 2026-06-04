import { useState, useRef } from 'react';
import { UploadCloud, FileText, ImageIcon, Download, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@utils/cn';
import { useTaskStore } from '@services/taskStore';
import Button from "@components/ui/Button";

const FileUpload = ({ taskId, currentAttachments = [], onAdd, onDelete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    const allowedExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setError('Unsupported file type. Please upload PDF, DOC, DOCX or Images.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5 MB limit.');
      return;
    }

    setError('');
    const fileObj = {
      name: file.name,
      size: file.size
    };

    if (onAdd) {
      onAdd(fileObj);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current.click();
  };

  const getFileIcon = (type) => {
    if (['png', 'jpg', 'jpeg'].includes(type.toLowerCase())) {
      return <ImageIcon className="h-5 w-5 text-amber-500" />;
    }
    return <FileText className="h-5 w-5 text-[#13856f]" />;
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={cn(
          'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group',
          dragActive
            ? 'border-[#13856f] bg-[#e8f6f2]'
            : 'border-[#e6d6ca] bg-[#fffaf6] hover:border-[#13856f]/60 hover:bg-white'
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#e6d6ca] shadow-sm text-slate-500 group-hover:text-[#13856f] group-hover:border-[#13856f]/30 transition">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Drag & drop files or <span className="text-[#13856f] hover:underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supported: PDF, DOC, DOCX, PNG, JPG (Max 5MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Attachment Previews */}
      {currentAttachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentAttachments.map((att) => {
            const ext = att.name.split('.').pop() || att.type || 'unknown';
            return (
              <div
                key={att.id}
                className="flex items-center justify-between border border-[#ead8cb] rounded-2xl bg-white p-3.5 shadow-sm group hover:border-[#13856f]/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-[#e6d6ca]">
                    {getFileIcon(ext)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={att.name}>
                      {att.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {att.size} • {att.date || 'Today'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="custom" size="none"
                    type="button"
                    title="Download mockup file"
                    className="p-1.5 text-slate-400 hover:text-[#13856f] rounded-lg hover:bg-slate-50 transition"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button variant="custom" size="none"
                      type="button"
                      onClick={() => onDelete(att.id)}
                      title="Remove attachment"
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
