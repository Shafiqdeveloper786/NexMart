"use client";

import { deleteProduct, updateProduct, ProductSummary } from "@/lib/actions/product.actions";
import { Plus, Trash2, ExternalLink, Search, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCrudTableProps {
  initialProducts: ProductSummary[];
}

export function ProductCrudTable({ initialProducts }: ProductCrudTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = initialProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product ${name}?`)) return;

    try {
      await deleteProduct(id);
      toast.success(`${name} deleted successfully`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleToggleActive = async (id: string, name: string, currentStatus: boolean) => {
    try {
      await updateProduct(id, { isActive: !currentStatus });
      toast.success(`${name} ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update product status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs focus:border-foreground outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Add Product Button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-wider hover:opacity-85 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Grid List Table */}
      <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                          {p.images[0] ? (
                            // Use standard img tag in admin table to avoid next/image hostname restrictions
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-muted-foreground">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground block truncate max-w-[200px]">
                            {p.name}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground block uppercase">
                            SKU: {p.sku || p.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-foreground">${p.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className={`font-mono font-bold ${p.stock < 10 ? "text-rose-500" : "text-muted-foreground"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                        p.stock > 0 ? "status-delivered" : "status-cancelled"
                      }`}>
                        {p.stock > 0 ? "ONLINE" : "DEPLETED"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
                          title="View in store"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={13} />
                        </Link>
                        <button
                          onClick={() => handleToggleActive(p.id, p.name, p.isActive)}
                          disabled={isPending}
                          className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                            p.isActive
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={p.isActive ? "Deactivate product" : "Activate product"}
                        >
                          {p.isActive ? "⏸" : "▶"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={isPending}
                          className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
