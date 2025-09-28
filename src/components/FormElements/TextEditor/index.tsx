"use client";

import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = async (file: File): Promise<string> => {
    if (onImageUpload) {
      return await onImageUpload(file);
    }

    // Default: convert to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const addImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const imageUrl = await handleImageUpload(file);
        editor?.chain().focus().insertContent({
          type: 'image',
          attrs: {
            src: imageUrl,
            alt: 'Uploaded image',
          },
        }).run();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: defaultValue || value || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (handleChange) {
        handleChange(html);
      }
      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
          "prose-headings:text-dark dark:prose-headings:text-white",
          "prose-p:text-dark dark:prose-p:text-white",
          "prose-strong:text-dark dark:prose-strong:text-white",
          "prose-em:text-dark dark:prose-em:text-white",
          "prose-ul:text-dark dark:prose-ul:text-white",
          "prose-ol:text-dark dark:prose-ol:text-white",
          "prose-li:text-dark dark:prose-li:text-white"
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && (value !== undefined || defaultValue !== undefined)) {
      const currentContent = editor.getHTML();
      const newContent = value || defaultValue || "";
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [editor, value, defaultValue]);

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      <label className="text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="mt-3">
        <div className="rounded-lg border-[1.5px] border-stroke bg-transparent dark:border-dark-3 dark:bg-dark-2">
          {/* Toolbar */}
          <div className="border-b border-stroke p-3 dark:border-dark-3">
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-bold transition-colors",
                  editor.isActive("bold")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm italic font-medium transition-colors",
                  editor.isActive("italic")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-medium line-through transition-colors",
                  editor.isActive("strike")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                S
              </button>
              <div className="h-6 w-px bg-stroke dark:bg-dark-3 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-bold transition-colors",
                  editor.isActive("heading", { level: 1 })
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-semibold transition-colors",
                  editor.isActive("heading", { level: 2 })
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-medium transition-colors",
                  editor.isActive("heading", { level: 3 })
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                H3
              </button>
              <div className="h-6 w-px bg-stroke dark:bg-dark-3 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-medium transition-colors",
                  editor.isActive("bulletList")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-medium transition-colors",
                  editor.isActive("orderedList")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                1. List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                  "rounded px-2 py-1 text-sm font-medium transition-colors",
                  editor.isActive("blockquote")
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3"
                )}
              >
                Quote
              </button>
              <div className="h-6 w-px bg-stroke dark:bg-dark-3 mx-1"></div>
              <button
                type="button"
                onClick={addImage}
                className="rounded px-2 py-1 text-sm font-medium text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-3 transition-colors"
                title="Upload Image"
              >
                📷 Image
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="relative">
            <EditorContent
              editor={editor}
              className="min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-0 [&_.ProseMirror_.is-editor-empty::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty::before]:text-dark-6 [&_.ProseMirror_.is-editor-empty::before]:float-left [&_.ProseMirror_.is-editor-empty::before]:h-0 [&_.ProseMirror_.is-editor-empty::before]:pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={editor.getHTML()}
          required={required}
        />
      )}
    </div>
  );
};

export default TextEditor;