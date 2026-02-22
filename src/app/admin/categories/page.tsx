import { createClient } from "@/lib/supabase/server";
import { addCategory, deleteCategory } from "@/lib/actions/admin";
import { FolderOpen, Plus, Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, gems:gems(count)")
    .order("display_order");

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Manage Categories
      </h2>

      {/* Add Category */}
      <form
        action={addCategory}
        className="bg-card-bg border border-card-border rounded-xl p-4 mb-6 flex gap-3"
      >
        <input
          name="name"
          type="text"
          required
          placeholder="New category name"
          className="flex-1 bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {/* Category List */}
      {!categories || categories.length === 0 ? (
        <p className="text-sm text-muted bg-card-bg border border-card-border rounded-xl p-6 text-center">
          No categories yet
        </p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const gemCount =
              Array.isArray(cat.gems) && cat.gems.length > 0
                ? (cat.gems[0] as { count: number }).count
                : 0;

            return (
              <div
                key={cat.id}
                className="bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4"
              >
                <FolderOpen className="text-gold shrink-0" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {cat.name}
                  </p>
                  <p className="text-xs text-muted">
                    /{cat.slug} &middot; {gemCount} gem{gemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteCategory(cat.id);
                  }}
                >
                  <button
                    type="submit"
                    className="p-2 text-muted hover:text-red-400 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
