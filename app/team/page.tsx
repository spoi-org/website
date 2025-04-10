import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Metadata } from "next";
import { ratingCache } from "@/lib/utils.server";

export const metadata: Metadata = {
  title: "SPOI - Our Team",
  description: "The team behind the training program for Indian students preparing for the International Olympiad in Informatics",
  openGraph: {
    type: "website",
    title: "SPOI - Our Team",
    description: "The team behind the training program for Indian students preparing for the International Olympiad in Informatics"
  },
  keywords: "inoi,ioi,ioitc,indian olympiad,competitive programming,spoi,iarcs,newbie,learn"
};

function Tile({ rating, heading, children, user }: Readonly<{
  rating: number;
  user: string;
  heading: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="py-3 md:px-6 w-full md:w-1/2 xl:w-1/3">
      <div className="shadow-md rounded-lg bg-cyan-100 dark:bg-gray-800 h-full p-8 hover:scale-105 transition flex flex-col justify-center dark:shadow-gray-70">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-bold">{heading}</h2>
          <Link href={"https://codeforces.com/profile/" + user} target="_blank" className="rounded-md w-max flex justify-center items-center gap-1 mb-2 float-right">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z" />
            </svg>
            <Rating rating={rating} className="font-bold" />
          </Link>
        </div>
        <p className="text-lg">{children}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main className="py-5 text-center px-10">
        <h1 className="text-8xl font-bold">Our Team</h1>
        <p className="text-2xl">The list of dedicated trainers who skillfully pass on their past experiences!</p>
      </main>
      <h4 className="text-5xl font-bold mt-8 mb-4">Founders</h4>
      <div className="flex flex-wrap justify-center w-full items-stretch px-10">
        <Tile heading="Samik Goyal" rating={ratingCache["unforgettablepl"]} user="unforgettablepl">
          IOI&#39;24 Silver | IOITC&#39;24
        </Tile>
        <Tile heading="Oviyan Gandhi" rating={ratingCache["oviyan_gandhi"]} user="oviyan_gandhi">
          IOITC&#39;24 | INOI&#39;24 Gold
        </Tile>
        <Tile heading="Avighna Chhatrapati" rating={ratingCache["avighnakc"]} user="avighnakc">
          IOITC&#39;24 | INOI&#39;24 Silver
        </Tile>
      </div>
      <h4 className="text-5xl font-bold mt-8 mb-4">Trainers</h4>
      <div className="flex flex-wrap justify-center w-full items-stretch px-10">
        <Tile heading="Shreyan Ray" rating={ratingCache["Dominater069"]} user="Dominater069">
          ICO Scientific Committee | IOI&#39;23 Silver
        </Tile>
        <Tile heading="Aditya Jain" rating={ratingCache["Everule"]} user="Everule">
          ICO Scientific Committee | IOI&#39;21 Team
        </Tile>
        <Tile heading="Paras Kasmalkar" rating={ratingCache["blue"]} user="blue">
          ICO Scientific Committee | 2x IOI Silver
        </Tile>
        <Tile heading="Naveen Kulkarni" rating={ratingCache["evenvalue"]} user="evenvalue">
          IOITC&#39;24 | INOI&#39;24 Silver
        </Tile>
        <Tile heading="Yash Haresh Thakker" rating={ratingCache["PoPularPlusPlus"]} user="PoPularPlusPlus">
          IOI&#39;24 Bronze | 3x INOI Gold
        </Tile>
        <Tile heading="Hari Aakash K" rating={ratingCache["hariaakash646"]} user="hariaakash646">
          IOITC&#39;24 | INOI&#39;24 Gold
        </Tile>
        <Tile heading="Jishnu Roychoudhury" rating={ratingCache["astoria"]} user="astoria">
          ICO Scientific Committee | NOI Gold
        </Tile>
        <Tile heading="Rushil Mathur" rating={ratingCache["rm1729"]} user="rm1729">
          IMO&#39;24 Gold | IOITC&#39;24
        </Tile>
        <Tile heading="Saarang Srinivasan" rating={ratingCache["saarang"]} user="saarang">
          IOITC&#39;22 | INOI&#39;22 Gold
        </Tile>
      </div>
      <h4 className="text-5xl font-bold mt-8 mb-4">Contributors</h4>
      <div className="flex flex-wrap justify-center w-full items-stretch px-10">
        <Tile heading="Harleen Singh" rating={ratingCache["OIaspirant2307"]} user="OIaspirant2307">
          INOI&#39;24 Bronze
        </Tile>
        <Tile heading="Aarav Malani" rating={ratingCache["aaravmalani"]} user="aaravmalani">
          SEO Specialist | Website Lead Developer
        </Tile>
        <Tile heading="Kumar Akshat" rating={ratingCache["oddvalue"]} user="oddvalue">
          Codeforces Problem Tester
        </Tile>
      </div>
    </div>
  );
}
