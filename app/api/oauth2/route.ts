import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { auths } from "@/lib/utils";
import { cookies } from "next/headers";
export async function GET(request: Request) {
    let params = new URL(request.url).searchParams;
    if (!params.has("code")) {
        return redirect("https://discord.com/oauth2/authorize?client_id=1274686791542116404&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth2&scope=identify");
    }

    let req = await fetch("https://discord.com/api/v10/oauth2/token", {
        method: "POST",
        body: new URLSearchParams([
            ["grant_type", "authorization_code"],
            ["code", params.get("code") as string],
            ["redirect_uri", "http://localhost:3000/api/oauth2"]
        ]),
        headers: new Headers([
            ["Authorization", "Basic " + process.env.CLIENT_AUTH]
        ])
    })
    let data = await req.json();
    if (!req.ok) {
        console.log(data);
        return redirect("https://discord.com/oauth2/authorize?client_id=1274686791542116404&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth2&scope=identify");
    }

    let req2 = await fetch("https://discord.com/api/v10/users/@me",
        {
            headers: new Headers([["Authorization", "Bearer " + data.access_token]])
        }
    ).then(req => req.json())
    let ssid = randomUUID();
    let avatar = "";
    if (!req2.avatar) {
        const defaultAvatarIndex = (BigInt(req2.id) >> BigInt(22)) % BigInt(6);
        avatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
    } else {
        avatar = `https://cdn.discordapp.com/avatars/${req2.id}/${req2.avatar}.png?size=256`;
    }
    auths[ssid] = { avatar, id: req2.id, name: req2.username}
    let store = cookies();
    store.set("__ssid", ssid);
    return redirect("/")



}
