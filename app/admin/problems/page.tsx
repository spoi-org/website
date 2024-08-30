import { cache } from "../../../lib/utils.server";
import AdminProblems from "./component";

export default async function ProblemsPage(){
  const problems = cache.problem.all();
  return <AdminProblems problems={problems} />
}