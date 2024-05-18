export const dynamic = "force-dynamic"

interface LoginPageProps {
  searchParams: {
    email?: string
  }
}

export default async function LoginPage(props: LoginPageProps) {
  return (
    <>
      <div className="text-sm">We have sent you an email at <b>{props.searchParams.email}</b></div>
    </>
  )
}

