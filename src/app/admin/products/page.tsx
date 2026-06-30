import { getAllProducts } from "@/lib/actions/product.actions";
import { ProductCrudTable } from "@/components/admin/ProductCrudTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // Fetch all products using our extended helper action
  const products = await getAllProducts({
    limit: 200, // Load enough for admin list
  });

  return (
    <div className="space-y-8 text-foreground bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Product Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and organise your product listings</p>
        </div>
      </div>

      {/* Crud Table */}
      <ProductCrudTable initialProducts={products} />
    </div>
  );
}
