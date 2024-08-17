import { Button } from "@/components/ui/button";
import Link from "next/link";

function Tile({ heading, children }: Readonly<{
    heading: string;
    children: React.ReactNode;
}>) {
    return (
        <div className="p-6 w-1/3">
            <div className="shadow-md rounded-lg text-center bg-sky-100 h-full p-8 hover:scale-105 transition">
                <h2 className="text-2xl font-bold mb-2">{heading}</h2>
                <p className="text-lg">{children}</p>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <>
            <main className="flex flex-col items-center justify-center">
                <div className="py-5 text-center px-10">
                    <h1 className="text-8xl font-bold mb-3">SPOI Mentoring</h1>
                    <p className="text-4xl">The Shortest Path to IOI</p>


                </div>
                <div className="flex flex-wrap justify-center w-full items-stretch px-10">
                    <Tile heading="Expert Mentors">
                        Learn from the best! Our team includes IOI, IMO, APIO, and INOI medalists. All our trainers have qualified for IOITC in the past.
                    </Tile>
                    <Tile heading="Tailored Content">
                        Our content is specially designed to target the ZCO and INOI exams, ensuring you get the most relevant training for success.
                    </Tile>
                    <Tile heading="Problem Solving & Debugging">
                        Struggling with a problem? Get personalized help with solving problems and debugging from our experienced mentors.
                    </Tile>
                    <Tile heading="Supportive Community">
                        Join an amazing community of like-minded competitive programming enthusiasts. Share your journey, collaborate, and grow together with peers who share your passion.
                    </Tile>
                    <Tile heading="Structured Syllabus">
                        Follow a well-structured syllabus that covers everything from basic to advanced competitive programming concepts, guiding you every step of the way through regular lectures, curated problem sets, and mock ZCO & INOI contests.
                    </Tile>
                    <Tile heading="Educational Resources">
                        Explore a wealth of educational content available on our website, including hints and detailed editorials for mock contests and olympiad problems, designed to supplement your learning and help you excel in the Indian Computing Olympiad.
                    </Tile>
                </div>
            </main>
        </>
    );
}