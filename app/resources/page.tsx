import { cache } from "@/lib/utils.server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "SPOI | Resources",
    description: "The resources created by the training program for Indian students preparing for the International Olympiad in Informatics",
    openGraph: {
        type: "website",
        title: "SPOI | Resources",
        description: "The resources created by the training program for Indian students preparing for the International Olympiad in Informatics"
    },
    
};

export default function CategoriesPage() {
    return (
        <div className="text-lg flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold mb-10 flex justify-center items-center">Categories</h1>
            <ul className="grid">
                {cache.category.all().map(c => (
                    <Link key={c.id} href={`/resources/${c.id}`}>
                        <li className="shadow-md rounded-lg text-center bg-sky-100 dark:bg-gray-800 py-5 px-8 hover:scale-105 transition mb-5">
                            {c.name}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}