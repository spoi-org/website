
import { cache } from "../../lib/utils.server";
import AdminHome from "./component";

export default function Admin() {
  const users = cache.user.all();
  return <AdminHome users={users} />;
}