"use client"
import { Button } from "@/components/ui/button";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "../modal";

export default function Users() {
    let [state, setState] = useState<number>(0);
    let [state2, setState2] = useState<any>(null);
    
    useEffect(() => {
        setState2(null);
        fetch("/api/admin/users?skip=" + state).then((x) => x.json()).then((x: User[]) => {
            setState2(<>{x.map((user) => <tr key={user.id}><td>{user.id}</td><td className="flex items-center gap-2"><img src={user.avatar} className="h-[5rem] rounded-[50%]" /><span>{user.dcUserName}</span></td><td>{user.createdAt.toString()}</td><td>{user.admin ? "✅" : "❌"}</td><td> <Button onClick={()=>{

            }}>VIEW COMMENTS</Button> </td></tr>)}</>);
        });
    }, [state])


    return (
        <div className="flex flex-col justify-center items-center">
            {state2 ?  <table className="text-center">
                <thead className="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 "><tr><th>ID</th><th>Username</th><th>Created At</th><th>Admin</th><th>Comments</th></tr></thead>
                <tbody className="text-black [&_td]:p-2 bg-gray-300 dark:bg-gray-900 dark:text-gray-400">
                    {state2}
                </tbody>

            </table> : <div>Loading</div>}
            
            <div>
                <Button onClick={()=>setState(state-1)}><FontAwesomeIcon icon={faChevronLeft} /></Button> <Button onClick={()=>setState(state+1)}><FontAwesomeIcon icon={faChevronRight} /></Button>
            </div>
            <Modal user="moyai" />
        </div>
    )
}