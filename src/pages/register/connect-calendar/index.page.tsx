import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Header, RegisterContainer } from "../styles";
import { ArrowRight, Check } from "phosphor-react";

import { useRouter } from "next/router";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { NextSeo } from "next-seo";



export default function ConnectCalendar(){

    const router = useRouter()

    const session = useSession()

    const hasAuthError = !!router.query.error
    const isSignedIn = session.status === 'authenticated'


    async function handleConnectCalendar() {

        await signIn('google')
    }

    async function handleNavigateToNextStep(){

        await router.push('/register/time-intervals')
    }


    return (
        <>
         <NextSeo
            title="Conecte sua agenda do google | Ignite Call"
            noindex
         />
        
        <RegisterContainer>
            <Header>
                <Heading as='strong'>Conecte sua agenda!</Heading>
                <Text>Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.</Text>

                <MultiStep size={4} currentStep={2}/>
            </Header>

            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calendar</Text>
                    {isSignedIn? (
                        <Button disabled size='sm'>
                            Conectado
                            <Check/>
                        </Button>
                    )
                    : 
                    <Button onClick={handleConnectCalendar} variant='secondary' size='sm'>
                        Conectar
                        <ArrowRight/>
                    </Button>
                    }
                </ConnectItem>

                {hasAuthError && isSignedIn && <AuthError size='sm'>Falha ao se conectar ao Google, verifique se você habilitou as permissões necessárias.</AuthError>}
                
                <Button onClick={handleNavigateToNextStep} disabled={!isSignedIn} type="submit">
                        Próximo passo
                        <ArrowRight/>
                </Button>
            </ConnectBox>


            
            
        </RegisterContainer>
        </>
    )
}

export const getServerSideProps : GetServerSideProps = async ({req, res}) => {

    const session = await getServerSession(req, res, buildNextAuthOptions(req, res))

    return {
        props: {
            session
        }
    }

}