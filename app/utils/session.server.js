import { createCookieSessionStorage, redirect } from "@remix-run/node"
import bcrypt from "bcryptjs"
import { db } from "./db.server"

export async function getUserByEmail(email) {
  return await db.user.findUnique({
    where: {
      email,
    },
  })
}

export async function register({ name, email, password }) {
  const hash = await bcrypt.hash(password, 10)

  return await db.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  })
}

export async function login(email, password) {
  const user = await getUserByEmail(email)

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) return null

  return user
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error("SESSION_SECRET must be set")

const oneDay = 1000 * 60 * 60 * 24
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    secrets: [sessionSecret],
    maxAge: oneDay,
    path: "/",
    sameSite: "lax",
  },
})

export async function createUserSession(userId) {
  const session = await getSession()
  session.set("userId", userId)

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

function getUserSession(request) {
  const cookie = request.headers.get("Cookie")
  return getSession(cookie)
}

export async function getUserId(request) {
  const userSession = await getUserSession(request)
  if (!userSession.has("userId")) return null

  const userId = userSession.get("userId")
  return userId
}

export async function requireSession(request) {
  const userId = await getUserId(request)
  if (!userId) throw redirect("/login")

  return userId
}

export async function noRequireSession(request) {
  const userId = await getUserId(request)
  if (userId) throw redirect("/")
}

export async function logout(request) {
  const session = await getUserSession(request)
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}
