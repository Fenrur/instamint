import {HttpErrorCode} from "@/http/http-error-code"
import {NextResponse} from "next/server"
import {z} from "zod"

interface Problem {
  status: number
  errorCode: HttpErrorCode
  title: string
  detail?: string
  type?: string
}

export function problem(Problem: Problem) {
  const problem = NextResponse.json(Problem, {status: Problem.status})
  problem.headers.set("Content-Type", "application/problem+json")
  return problem
}

const GetCode = z.object({
  errorCode: z.number().int().positive()
})

export function getErrorCodeFromProblem(e: any): HttpErrorCode {
  try {
    const parsed = GetCode.parse(e)
    return parsed.errorCode
  } catch {
    throw e
  }
}
