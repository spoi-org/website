import Link from "next/link";
import { Rating } from "../rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

function Tile({ rating, heading, children, user }: Readonly<{
    rating: number;
    user: string;
    heading: string;
    children: React.ReactNode;
}>) {
    return (
        <div className="p-6 w-1/3">
            <div className="shadow-md rounded-lg text-center bg-gray-100 dark:bg-gray-800 h-full p-8 hover:scale-105 transition flex flex-col justify-center items-center dark:shadow-gray-70">
                <h2 className="text-2xl font-bold mb-2">{heading}</h2>
                <Link href={"https://codeforces.com/profile/" + user} target="_blank" className="p-4 bg-blue-200 dark:bg-[#0b1215] rounded-md w-max flex justify-center items-center gap-3">
                    <span>Codeforces:&nbsp;<Rating rating={rating} className="font-bold" /></span>
                    <FontAwesomeIcon icon={faLink} className="h-3" />
                </Link>
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

            <h4 className="text-5xl font-bold mt-[3rem]">Trainers</h4>
            <div className="flex flex-wrap justify-center w-full items-stretch px-10">
                <Tile heading="Oviyan Gandhi" rating={1917} user="oviyan_gandhi">
                    IOITC'24 rank 5 | INOI Gold Medal | CodeChef 5*
                </Tile>
                <Tile heading="Avighna Chhatrapati" rating={1817} user="avighnakc">
                    IOITC'24 | INOI'24 Silver Medalist, top 30 in India
                    
                </Tile>
                <Tile heading="Samik Goyal" rating={2096} user="unforgettablepl">
                    IOI Team Member + INOI Gold Medal + #4 in India + 0* on codechef + 36 rated on atcoder
                </Tile>
                <Tile heading="Shreyan Ray" rating={2760} user="Dominater069">
                    IOI Silver + INOI Gold Medal + #1 in India
                </Tile>
                <Tile heading="Aditya Jain" rating={2610} user="Everule">
                    🗿
                </Tile>
                <Tile heading="Paras Kasmalkar" rating={2281} user="blue">
                    🗿
                </Tile>
                <Tile heading="Naveen Kulkarni" rating={2236} user="evenvalue">
                    🤮
                </Tile>

                <Tile heading="Yash Haresh Thakker" rating={2233} user="PoPularPlusPlus">
                    🗿
                </Tile>
                <Tile heading="Hari Aakash K" rating={2229} user="hariaakash646">
                    🗿
                </Tile>

                <Tile heading="Jishnu Roychoudhury" rating={1976} user="astoria">
                    🗿
                </Tile>
                <Tile heading="Vibhaas Nirantar Srivastava" rating={1826} user="accord">
                    🗿
                </Tile>

                <Tile heading="Saarang Srinivasan" rating={1810} user="saarang">
                    🗿
                </Tile>

                <Tile heading="Adhish Kancharla" rating={1748} user="ak2006">
                    🗿
                </Tile>
            </div>
            <h4 className="text-5xl font-bold mt-[3rem]">Contributors</h4>
            <div className="flex flex-wrap justify-center w-full items-stretch px-10">

                <Tile heading="OIaspirant2307" rating={1405} user="OIaspirant2307">
                    🗿
                </Tile>
                <Tile heading="Aarav Malani" rating={1035} user="aaravmalani">
                    Website Developer + ultra skill issue
                </Tile>

                <Tile heading="Kumar Akshat" rating={1216} user="oddvalue">
                    Nepotism
                </Tile>


                <Tile heading="Harsh Sharma" rating={1476} user="codula">
                    🗿
                </Tile>

            </div>

        </div>
    );
}
