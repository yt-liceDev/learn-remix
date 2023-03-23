import { Form, Link } from "@remix-run/react"
import { json, useActionData } from "react-router"
import FormControl from "../components/FormControl"
import Input from "../components/Input"
import Label from "../components/Label"
import { createUserSession, login, noRequireSession } from "../utils/session.server"

export async function loader({ request }) {
  await noRequireSession(request)

  return null
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const { email, password } = Object.fromEntries(formData)

  const user = await login(email, password)

  if (!user)
    return json({
      fieldError: "email or password wrong",
    })

  return createUserSession(user.id)
}

export default function Login() {
  const actionData = useActionData()

  return (
    <div className="h-[90vh] flex flex-col justify-center items-center">
      <div className="bg-white w-[80vw] p-4 rounded-md shadow-sm">
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        {actionData?.fieldError && (
          <p className="text-red-600 text-center">{actionData.fieldError}</p>
        )}
        <Form method="post" className="mt-8 space-y-6 px-4">
          <FormControl>
            <Label text="Email" />
            <Input type="email" name="email" />
          </FormControl>
          <FormControl>
            <Label text="Password" />
            <Input type="password" name="password" />
          </FormControl>
          <div className="text-center py-4">
            <button
              type="submit"
              className="bg-violet-600 disabled:cursor-not-allowed hover:bg-violet-700 text-slate-100 hover:text-slate-200 py-2 px-6 font-bold rounded-md"
            >
              Login
            </button>
          </div>
        </Form>
      </div>
      <p className="pt-8">
        don't have account?
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
