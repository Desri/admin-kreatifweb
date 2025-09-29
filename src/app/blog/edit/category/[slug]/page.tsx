"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getCategoryById, updateCategory } from "@/services/category.services";
import InputGroup from "@/components/FormElements/InputGroup";
import type { CreateCategoryRequest, Category } from "@/types/category";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";

export default function FormEditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.slug as string;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setIsLoading(true);
        const response = await getCategoryById(categoryId);

        if (response.success && response.data) {
          const category = Array.isArray(response.data) ? response.data[0] : response.data as Category;
          setFormData({
            name: category.name || "",
            description: category.description || "",
            isActive: true,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load category");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const categoryData: Partial<CreateCategoryRequest> = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      };

      await updateCategory(categoryId, categoryData);
      setSuccess(true);

      // Optionally redirect back to category list after successful update
      setTimeout(() => {
        router.push('/blog/category');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <>
        <Breadcrumb pageName="Edit Category" />
        <div className="grid grid-cols-1 gap-9">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Edit Category" className="space-y-5.5 !p-6.5">
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-600">Loading category...</div>
              </div>
            </ShowcaseSection>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Edit Category" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Category" className="space-y-5.5 !p-6.5">
            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-100 p-4 text-green-700">
                Category updated successfully! Redirecting to category list...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5.5">
              <InputGroup
                label="Category"
                placeholder="Input category"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <TextAreaGroup
                label="Meta Description"
                placeholder="Add your meta description here..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Edit Category"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
