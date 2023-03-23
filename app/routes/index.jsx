import { json } from "@remix-run/node"
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react"
import { Plus, Trash2 } from "lucide-react"
import Balance from "../components/Balance"
import Expense from "../components/Expense"
import Income from "../components/Income"
import Layout from "../components/Layout"
import { formatCurrenty } from "../libs/currency"
import { getMoney } from "../libs/get-money"
import { db } from "../utils/db.server"
import { requireSession } from "../utils/session.server"

export async function loader({ request }) {
  const userId = await requireSession(request)

  return json(
    await db.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  )
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const id = formData.get("id")

  return json(
    await db.transaction.delete({
      where: {
        id,
      },
    }),
  )
}

export default function Index() {
  const data = useLoaderData()
  const submit = useSubmit()

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const isConfirm = confirm("Are you sure?")

    if (!isConfirm) return
    submit(formData, { method: "post" })
  }

  return (
    <Layout>
      <div className="grid sm:justify-center">
        <section className="grid justify-center content-center gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Balance money={formatCurrenty(getMoney(data, "balance"))} />
          <Income money={formatCurrenty(getMoney(data, "income"))} />
          <Expense money={formatCurrenty(getMoney(data, "expense"))} />
        </section>
        <section className="py-6">
          <h3 className="text-xl text-gray-800">History</h3>
          <div className="max-h-60 py-4 overflow-y-auto space-y-4">
            {data?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md shadow-md flex justify-between p-4"
              >
                <p>{item.name}</p>
                <div className="flex space-x-2">
                  <p>{formatCurrenty(item.money)}</p>
                  <Form method="post" onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit">
                      <Trash2 size={20} />
                    </button>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div>
          <Link
            to="/new-transaction"
            className="bg-sky-600 rounded-md hover:bg-sky-700 text-slate-100 hover:text-slate-200 w-40 py-2 px-4 flex space-x-2"
          >
            <Plus color="white" /> Transaction
          </Link>
        </div>
      </div>
    </Layout>
  )
}
