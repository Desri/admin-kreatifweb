"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type TextEditorProps = {
  className?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  handleChange?: (value: string) => void;
  onChange?: (value: string) => void;
  defaultValue?: string;
  onImageUpload?: (file: File) => Promise<string>;
  rows?: number;
};

const TextEditor: React.FC<TextEditorProps> = ({
  className,
  label,
  placeholder = "Masukkan konten...",
  required,
  disabled,
  value,
  name,
  handleChange,
  onChange,
  defaultValue,
  onImageUpload,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only initialize Quill on the client side
    if (typeof window !== "undefined" && editorRef.current && !quillInstanceRef.current) {
      import("quill").then((Quill) => {
        const QuillConstructor = Quill.default;

        const quill = new QuillConstructor(editorRef.current!, {
          theme: "snow",
          placeholder: placeholder,
          readOnly: disabled,
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "code-block"],
              [{ align: [] }],
              ["link", "image"],
              ["clean"],
            ],
          },
        });

        // Custom image handler
        const toolbar = quill.getModule('toolbar') as any;
        if (toolbar && toolbar.addHandler) {
          toolbar.addHandler('image', () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (file) {
                if (onImageUpload) {
                  try {
                    // Show loading state
                    const range = quill.getSelection(true);
                    quill.insertText(range.index, 'Uploading image...');
                    quill.setSelection(range.index + 19);

                    // Upload image
                    const url = await onImageUpload(file);

                    // Remove loading text and insert image
                    quill.deleteText(range.index, 19);
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    // Remove loading text on error
                    const range = quill.getSelection();
                    if (range) {
                      quill.deleteText(range.index - 19, 19);
                    }
                  }
                } else {
                  // Fallback: show warning if no upload handler provided
                  alert('Image upload handler not configured. Please contact support.');
                }
              }
            };
          });
        }

        // Set initial value
        if (value || defaultValue) {
          quill.clipboard.dangerouslyPasteHTML(value || defaultValue || "");
        }

        // Handle content changes
        quill.on("text-change", () => {
          const html = quill.root.innerHTML;
          if (handleChange) {
            handleChange(html);
          }
          if (onChange) {
            onChange(html);
          }
        });

        quillInstanceRef.current = quill;
      });
    }

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor content when value changes externally
  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined) {
      const currentContent = quillInstanceRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value || "");
      }
    }
  }, [value]);

  // Update disabled state
  useEffect(() => {
    if (quillInstanceRef.current) {
      quillInstanceRef.current.enable(!disabled);
    }
  }, [disabled]);

  return (
    <div className={className}>
      <label className="text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="mt-3">
        <div
          className={cn(
            "rounded-lg border-[1.5px] border-stroke bg-transparent dark:border-dark-3 dark:bg-dark-2",
            "[&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-stroke [&_.ql-toolbar]:dark:border-dark-3",
            "[&_.ql-container]:border-0",
            "[&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-dark [&_.ql-editor]:dark:text-white",
            "[&_.ql-editor.ql-blank::before]:text-dark-6 [&_.ql-editor.ql-blank::before]:dark:text-dark-6",
            "[&_.ql-stroke]:stroke-dark [&_.ql-stroke]:dark:stroke-white",
            "[&_.ql-fill]:fill-dark [&_.ql-fill]:dark:fill-white",
            "[&_.ql-picker-label]:text-dark [&_.ql-picker-label]:dark:text-white",
            "[&_.ql-picker-options]:bg-white [&_.ql-picker-options]:dark:bg-dark-2",
            "[&_.ql-picker-item]:text-dark [&_.ql-picker-item]:dark:text-white",
            "[&_.ql-snow_.ql-picker.ql-expanded_.ql-picker-label]:border-primary"
          )}
        >
          <div ref={editorRef} />
        </div>
      </div>

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value || defaultValue || ""}
          required={required}
        />
      )}
    </div>
  );
};

export default TextEditor;