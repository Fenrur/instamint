import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import * as React from "react"

interface VerificationEmailProps {
  baseUrl: string;
  instamintImageUrl: string;
  verificationLink: string;
  contactEmail: string;
}

export const ResetPassword = ({
                                baseUrl,
                                instamintImageUrl,
                                verificationLink,
                                contactEmail,
                              }: VerificationEmailProps) => {
  const previewText = `Verify your mail on Instamint`

  return (
    <Html>
      <Head/>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={instamintImageUrl}
                width="60"
                alt="Instamint"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Reset your password Instamint <Link href={baseUrl}
                                                          className="text-green-400 underline">Instamint</Link></strong>
            </Heading>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={verificationLink}
              >
                Reset
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={verificationLink} className="text-blue-600 no-underline">
                {verificationLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full"/>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This link will expire in <span className="text-black">2 hours</span>. If you didn't request this, you
              can <span className="text-black">ignore this email</span>.
              <br/>
              If you have any questions, please contact us at <Link className="text-blue-600"
                                                                    href={`mailto:${contactEmail}`}>{contactEmail}</Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPassword.PreviewProps = {
  baseUrl: "http://localhost:3000",
  instamintImageUrl: "https://image.noelshack.com/fichiers/2024/16/5/1713534366-instamint.png",
  verificationLink: "http://localhost:3000/verify-email?uid=123",
  contactEmail: "contact-instamint@gmail.com"
} as VerificationEmailProps

export default ResetPassword
