"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updateProduct } from "@/lib/actions/product.actions";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  category: string;
  images: string[];
  stock: number;
  sku?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
}

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Accessories",
  "Grooming",
  "Office",
  "Kitchen",
  "Fitness",
  "Home Decor"
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    images: "",
    stock: "",
    sku: "",
    isFeatured: false,
    isActive: true,
    tags: "",
  });

  const resolvedParams = use(params);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description ?? "",
          price: data.price.toString(),
          originalPrice: data.originalPrice?.toString() ?? "",
          category: data.category,
          images: data.images.join("\n"),
          stock: data.stock.toString(),
          sku: data.sku ?? "",
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          tags: (data.tags ?? []).join(", "),
        });
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateProduct(resolvedParams.id, {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        images: formData.images.split("\n").filter(url => url.trim()),
        stock: parseInt(formData.stock),
        sku: formData.sku || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
      });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <p className="text-muted-foreground">Product not found</p>
        <Link href="/admin/products" className="text-primary hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update product information and settings
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                SKU (optional)
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. new, featured, sale"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Images</h2>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Image URLs (one per line)
            </label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Settings</h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground"
              />
              <div>
                <span className="text-sm font-semibold text-foreground">Featured Product</span>
                <p className="text-xs text-muted-foreground">Show in featured sections</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground"
              />
              <div>
                <span className="text-sm font-semibold text-foreground">Active</span>
                <p className="text-xs text-muted-foreground">Product is visible in store</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all text-sm font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background hover:opacity-85 transition-all text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}