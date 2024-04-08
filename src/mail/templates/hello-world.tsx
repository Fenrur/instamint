import {CodeBlock, dracula} from "@react-email/components"
import * as React from "react"

export default function Email() {
  const code = `export default async (req, res) => {
  try {
    const html = await renderAsync(
      EmailTemplate({ firstName: 'John' })
    );
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error });
  }
}`

  return (<CodeBlock
    code={code}
    lineNumbers
    theme={dracula}
    language="javascript"
  />)
}