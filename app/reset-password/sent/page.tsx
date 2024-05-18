export const dynamic = "force-dynamic"

interface SentResetPageProps {
  searchParams: {
    email?: string
  }
}

export default async function SentResetPage(props: SentResetPageProps) {
  return (
    <>
      <div className="text-sm">We have sent you an email at <b>{props.searchParams.email}</b></div>
    </>
  )
}

