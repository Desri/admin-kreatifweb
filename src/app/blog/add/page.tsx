"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import TextEditor from "@/components/FormElements/TextEditor";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Select } from "@/components/FormElements/select";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { createBlog } from "@/services/blog.service";
import { getCategory } from "@/services/category.services";
import { uploadImage } from "@/lib/image-upload";
import type { CreateBlogRequest } from "@/types/blog";

export default function FormElementsPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    metaDescription: "",
    file: null as File | null,
    content: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Handle image upload for text editor using global function
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      return await uploadImage(file);
    } catch (error) {
      // Error is already shown by uploadImage function
      throw error;
    }
  };

  const compressImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.7,
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality,
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type.startsWith("image/")) {
      // Compress image if it's larger than 1MB
      const compressedFile =
        file.size > 1024 * 1024 ? await compressImage(file, 800, 0.7) : file;

      setFormData((prev) => ({ ...prev, file: compressedFile }));

      // Create preview URL for images
      const url = URL.createObjectURL(compressedFile);
      setPreviewUrl(url);
    } else {
      setFormData((prev) => ({ ...prev, file }));
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategory();
        const categories = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const categoryItems = categories.map((category: any) => ({
          label: category.name,
          value: category._id,
        }));
        setCategories(categoryItems);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // const formatFileSize = (bytes: any) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      setIsSubmitting(false);
      return;
    }

    // Check if content is empty (handles HTML content from TextEditor)
    const textContent = formData.content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      setError("Content is required");
      setIsSubmitting(false);
      return;
    }

    // Check for base64 images in content
    if (formData.content.includes('data:image')) {
      setError("Content contains embedded images (base64). Please ensure all images are uploaded to the server first. Try removing and re-adding the images.");
      setIsSubmitting(false);
      return;
    }

    // Validate content size (max 1MB for content text)
    const contentSize = new Blob([formData.content]).size;
    if (contentSize > 1024 * 1024) {
      setError(`Content is too large (${(contentSize / 1024 / 1024).toFixed(2)}MB). Please reduce the content size or remove large embedded images.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const blogData: CreateBlogRequest = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        metaDescription: formData.metaDescription.trim(),
        content: formData.content,
      };

      console.log("Submitting blog data:", {
        ...blogData,
        contentSize: `${(contentSize / 1024).toFixed(2)}KB`,
      });
      await createBlog(blogData, formData.file || undefined);
      setSuccess(true);
      setFormData({
        title: "",
        category: "",
        metaDescription: "",
        file: null,
        content: "",
      });
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Add Article" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Add Article" className="space-y-5.5 !p-6.5">
            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-100 p-4 text-green-700">
                Blog created successfully!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5.5">
              <InputGroup
                label="Title"
                placeholder="Input title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <Select
                label="Category"
                placeholder="Select your category"
                className="mb-4.5"
                value={formData.category}
                onChange={(_id) =>
                  setFormData((prev) => ({ ...prev, category: _id }))
                }
                items={categories}
                disabled={loadingCategories}
              />
              <TextAreaGroup
                label="Meta Description"
                placeholder="Add your meta description here..."
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
              />
              <InputGroup
                type="file"
                fileStyleVariant="style2"
                label="Attach file"
                placeholder="Attach file"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">
                    Preview:
                  </h3>
                  <div className="relative overflow-hidden rounded-lg border bg-gray-50">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="my-3 h-auto max-h-64 w-full object-contain"
                    />
                    <button
                      onClick={removeFile}
                      className="absolute right-2 top-2 h-[33px] w-[33px] rounded-full bg-[#dddddd] font-medium text-black transition-colors"
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
              <TextEditor
                label="Content"
                placeholder="Add your content here..."
                rows={15}
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                onImageUpload={handleImageUpload}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
