import { redirect } from "react-router"
import { logout } from "../utils/session.server"

export const action = async ({ request }) => {
  return logout(request)
}

export async function loader() {
  return redirect("/login")
}
