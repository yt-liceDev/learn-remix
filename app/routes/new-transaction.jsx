import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import ErrorMsg from "../components/ErrorMsg"
import FormControl from "../components/FormControl"
import Input from "../components/Input"
import Label from "../components/Label"
import Layout from "../components/Layout"
import RadioButton from "../components/RadioButton"
import { validation } from "../libs/validation"
import { db } from "../utils/db.server"
import { getUserId, requireSession } from "../utils/session.server"

export async function loader({ request }) {
  await requireSession(request)

  return null
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const userId = await getUserId(request)
  const { name, money, category } = Object.fromEntries(formData)
  const fields = { name, money, category }

  const fieldError = {
    name: validation(name),
    money: validation(money),
    category: validation(category),
  }

  if (Object.values(fieldError).some(Boolean)) {
    return json(
      {
        fields,
        fieldError,
      },
      400,
    )
  }

  await db.transaction.create({
    data: {
      name: formData.get("name"),
      money: +formData.get("money"),
      userId,
      category: {
        create: {
          name: formData.get("category"),
        },
      },
    },
  })

  return redirect("/")
}

export default function NewTransaction() {
  const { state } = useNavigation()
  const actionData = useActionData()
  const isLoading = state === "submitting"

  return (
    <Layout>
      <section className="grid sm:justify-center">
        <Form
          method="post"
          className="bg-white space-y-4 p-4 rounded-md shadow-sm sm:w-[60vw]"
        >
          <h3 className="text-center text-2xl text-gray-800">Transaction</h3>
          <FormControl>
            <Label text="Name" />
            <Input name="name" defaultValue={actionData?.fields?.name} />
            <ErrorMsg message={actionData?.fieldError?.name} />
          </FormControl>
          <FormControl>
            <Label text="Category" />
            <div className="space-x-4">
              <RadioButton
                name="category"
                value="income"
                text="income"
                defaultChecked={actionData?.fields?.category === "income"}
              />
              <RadioButton
                name="category"
                value="expense"
                text="expense"
                defaultChecked={actionData?.fields?.category === "expense"}
              />
            </div>
            <ErrorMsg message={actionData?.fieldError?.category} />
          </FormControl>
          <FormControl>
            <Label text="Money" />
            <Input name="money" type="number" defaultValue={actionData?.fields?.money} />
            <ErrorMsg message={actionData?.fieldError?.money} />
          </FormControl>
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-sky-600 disabled:cursor-not-allowed hover:bg-sky-700 text-slate-100 hover:text-slate-100 py-2 px-6 rounded-md font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Add"}
            </button>
          </div>
        </Form>
      </section>
    </Layout>
  )
}
