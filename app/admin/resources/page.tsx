import { cache } from "@/lib/utils.server";
import AdminCategories from "./component";

export default async function CategoriesPage(){
  const categories = cache.category.all().sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  return <AdminCategories categories={categories} />
}