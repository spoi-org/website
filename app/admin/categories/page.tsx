import { prisma } from "@/lib/utils.server";
import AdminCategories from "./component";

export default async function CategoriesPage(){
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return <AdminCategories categories={categories} />
}