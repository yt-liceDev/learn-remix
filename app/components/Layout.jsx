import { Form } from "@remix-run/react"

export default function Layout({ children }) {
  return (
    <>
      <div className="flex items-center justify-center space-x-48">
        <h1 className="text-4xl mb-8 font-bold text-center">My Budget</h1>
        <Form method="post" action="/logout">
          <button type="submit">logout</button>
        </Form>
      </div>
      {children}
    </>
  )
}
