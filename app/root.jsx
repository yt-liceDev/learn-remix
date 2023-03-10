import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react"
import tailwind from "./tailwind.css"

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

export const links = () => [{ rel: "stylesheet", href: tailwind }]

function Document({ children }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <main className="p-8">
        <h1 className="text-4xl mb-8 font-bold text-center">My Budget</h1>
        <Outlet />
      </main>
    </Document>
  )
}

export function CatchBoundary() {
  const caugth = useCatch()

  return (
    <Document>
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-2xl mb-4">
          {caugth.status} : {caugth.statusText}
        </h1>
        <Link to="/">Back to home</Link>
      </div>
    </Document>
  )
}
