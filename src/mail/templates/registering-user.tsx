import {
  Body,
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

interface RegisteringUserProps {
  baseUrl: string;
  instamintImageUrl: string;
  profileLink: string;
  contactEmail: string;
  username: string;
}

export const RegisteringUser = ({
                                  baseUrl,
                                  instamintImageUrl,
                                  profileLink,
                                  contactEmail,
                                  username
                                }: RegisteringUserProps) => {
  const previewText = `Congratulation you are registered on Instamint`

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
              <strong>Congratulation you are registered on <Link href={baseUrl}
                                                                 className="text-green-400 underline">Instamint</Link></strong> !
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Access to your profile <Link className="underline" href={profileLink}>@{username}</Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full"/>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you have any questions, please contact us at <Link className="text-blue-600"
                                                                    href={`mailto:${contactEmail}`}>{contactEmail}</Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

RegisteringUser.PreviewProps = {
  baseUrl: "http://localhost:3000",
  instamintImageUrl: "https://image.noelshack.com/fichiers/2024/16/5/1713534366-instamint.png",
  profileLink: "http://localhost:3000/profile/fenrur",
  contactEmail: "contact-instamint@gmail.com",
  username: "fenrur",
} as RegisteringUserProps

export default RegisteringUser
