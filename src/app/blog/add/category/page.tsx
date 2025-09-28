"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createCategory } from "@/services/category.services";
import InputGroup from "@/components/FormElements/InputGroup";
import type { CreateCategoryRequest } from "@/types/category";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";

export default function FormAddCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const categoryData: CreateCategoryRequest = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      };

      await createCategory(categoryData);
      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Breadcrumb pageName="Add Category" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Add Category" className="space-y-5.5 !p-6.5">
            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-100 p-4 text-green-700">
                Category created successfully!
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
}
