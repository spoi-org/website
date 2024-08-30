import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cache } from "../../../lib/utils.server";

export async function GET(request: Request) {
  let params = new URL(request.url).searchParams;
  if (!params.has("code")) {
    return redirect("/");
  }

  let req = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    body: new URLSearchParams([
      ["grant_type", "authorization_code"],
      ["code", params.get("code") as string],
      ["redirect_uri", `${process.env.URL}/api/oauth2`]
    ]),
    headers: new Headers([
      ["Authorization", "Basic " + process.env.CLIENT_AUTH]
    ])
  })
  let data = await req.json();
  if (!req.ok) {
    return redirect("/");
  }

  let req2 = await fetch("https://discord.com/api/v10/users/@me",
    {
      headers: new Headers([["Authorization", "Bearer " + data.access_token]])
    }
  ).then(req => req.json())
  let avatar = "";
  if (!req2.avatar) {
    const defaultAvatarIndex = (BigInt(req2.id) >> BigInt(22)) % BigInt(6);
    avatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  } else {
    avatar = `https://cdn.discordapp.com/avatars/${req2.id}/${req2.avatar}.png?size=256`;
  }
  const resp = await fetch(`${process.env.API_URL}?id=${req2.id}`);
  if (!resp.ok || !(await resp.json()).verified)
    return redirect("/unauthorized");
  let user = await cache.user.upsert(req2.id, {
    update: {
      data: {
        avatar,
        dcUserName: req2.username
      }
    },
    insert: {
      data: {
        id: req2.id,
        avatar,
        dcUserName: req2.username
      }
    }
    
  }) 
  let ssid = await cache.sessionId.insert({
    data: {
      userId: user.id
    }
  })
  if (!cache.solves.get(user.id))
    cache.solves.insert(user.id, []);
  let store = cookies();
  store.set("__ssid", ssid.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
  return redirect("/")
}
