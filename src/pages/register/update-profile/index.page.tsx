import { Avatar, Button, Heading, MultiStep, Text, TextArea} from "@ignite-ui/react";
import { Header, RegisterContainer } from "../styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { FormAnnotaion, ProfileBox } from "./styles";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const updateProfileFormSchema = z.object({
   bio: z.string()
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export default function UpdateProfile(){

    const router = useRouter()

    const {register, handleSubmit, formState: {isSubmitting}} = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileFormSchema)
    })

    const session = useSession()

    async function handleUpdateProfile(data: UpdateProfileFormData){

        await api.put('/users/profile', data)

        await router.push(`/schedule/${session.data?.user.username}`)
    }

    console.log(session)

    return (
        <>
        <NextSeo
                    title="Atualize seu perfil | Ignite Call"
                    noindex
                 />
       <RegisterContainer>
        <Header>
                <Heading as='strong'>Quase lá</Heading>
                <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

                <MultiStep size={4} currentStep={4}/>
            </Header>

            <ProfileBox onSubmit={handleSubmit(handleUpdateProfile)} as='form'>
                <label>
                   <Text>Foto de perfil</Text>
                   <Avatar src={session.data?.user.avatar_url} alt={session.data?.user.name}/>
                </label>

                <label>
                    <Text size='sm'>Sobre você</Text>
                    <TextArea {...register('bio')}></TextArea>
                    <FormAnnotaion size='sm'>Fale um pouco sobre você. Isto será exibido em sua página pessoal.</FormAnnotaion>
                </label>

                <Button disabled={isSubmitting} type="submit">
                    Finalizar
                    <ArrowRight/>
                </Button>
            </ProfileBox>
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