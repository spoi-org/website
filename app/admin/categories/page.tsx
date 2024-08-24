import { cache } from "@/lib/utils.server";
import AdminCategories from "./component";

export default async function CategoriesPage(){
    const categories = cache.category.all();
    return <AdminCategories categories={categories} />
}