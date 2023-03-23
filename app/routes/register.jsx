import { json, redirect } from "@remix-run/node"
import { Form, Link, useActionData } from "@remix-run/react"
import FormControl from "../components/FormControl"
import Input from "../components/Input"
import Label from "../components/Label"
import { getUserByEmail, noRequireSession, register } from "../utils/session.server"

export async function loader({ request }) {
  await noRequireSession(request)

  return null
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const { name, email, password } = Object.fromEntries(formData)

  const userExist = await getUserByEmail(email)

  if (userExist)
    return json({
      fieldError: "email already exist",
    })

  await register({ name, email, password })
  return redirect("/login")
}

export default function Register() {
  const actionData = useActionData()

  return (
    <div className="h-[90vh] flex flex-col justify-center items-center">
      <div className="bg-white w-[80vw] p-4 rounded-md shadow-sm">
        <h1 className="text-center text-2xl font-semibold">Register</h1>
        {actionData?.fieldError && (
          <p className="text-red-600 text-center">{actionData.fieldError}</p>
        )}
        <Form method="post" className="mt-8 space-y-6 px-4">
          <FormControl>
            <Label text="Name" />
            <Input name="name" />
          </FormControl>
          <FormControl>
            <Label text="Email" />
            <Input type="email" name="email" />
          </FormControl>
          <FormControl>
            <Label text="Password" />
            <Input type="password" name="password" />
          </FormControl>
          <FormControl>
            <Label text="Confirm" />
            <Input type="password" name="password2" />
          </FormControl>
          <div className="text-center py-4">
            <button
              type="submit"
              className="bg-violet-600 disabled:cursor-not-allowed hover:bg-violet-700 text-slate-100 hover:text-slate-200 py-2 px-6 font-bold rounded-md"
            >
              Register
            </button>
          </div>
        </Form>
      </div>
      <p className="pt-8">
        already have account?
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
