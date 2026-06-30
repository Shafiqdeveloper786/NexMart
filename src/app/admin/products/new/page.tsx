"use client";

import { createProduct } from "@/lib/actions/product.actions";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STATED_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Accessories",
  "Grooming",
  "Office",
  "Kitchen",
  "Fitness",
  "Home Decor"
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    stock: "",
    sku: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) return toast.error("Product name is required");
    if (!formData.price || Number(formData.price) <= 0) return toast.error("Please enter a valid price");
    if (!formData.stock || Number(formData.stock) < 0) return toast.error("Please enter a valid stock quantity");
    if (!formData.imageUrl.trim()) return toast.error("At least one product image URL is required");

    setLoading(true);
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        stock: Math.floor(Number(formData.stock)),
        sku: formData.sku || undefined,
        images: [formData.imageUrl.trim()],
      });

      toast.success("Product added successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-foreground bg-background">
      {/* Back button link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={13} />
        <span>Back to Products</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below to add a new product to your catalog</p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 border border-border rounded-2xl space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-foreground">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM5 Neural-Link Edition"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a detailed list of neuro-upgrades, interfaces, specs..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors cursor-pointer"
            >
              {STATED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">SKU (optional)</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. SNY-WH1000-XM5"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>

          {/* Original Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Original Price (optional, for discount)</label>
            <input
              type="number"
              step="0.01"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="e.g. 199.00"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Image URL *</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-foreground outline-none text-foreground transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:opacity-85 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 disabled:opacity-50 shadow-sm"
        >
          <Save size={16} />
          <span>{loading ? "Saving..." : "Save Product"}</span>
        </button>
      </form>
    </div>
  );
}
