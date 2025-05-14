import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Preview } from "./styles";

import previewImage from '../../assets/image 1.png'
import Image from "next/image";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <NextSeo
      title="Descomplique sua agenda | Ignite Call"
      description="Conecte seu calendário e permita que as pesssoas marquem agendamentos em seu tempo livre"
      />
      <Container> 

        <Hero>
            <Heading as="h1" size="4xl">Agendamento descomplicado</Heading>
            <Text size="xl">Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.</Text>

            <ClaimUsernameForm/>
        </Hero>

        <Preview>
            <Image height={400} priority quality={100} src={previewImage} alt="Calendário simbolizando a aplicação em funcionamento"/>
        </Preview>

      </Container>
    </>
  );
}
