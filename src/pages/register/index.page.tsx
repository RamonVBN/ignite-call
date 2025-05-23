import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Form, FormError, Header, RegisterContainer } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
    username: z.string()
    .min(3, {message: 'O usuário precisa ter pelo menos 3 caracteres.'})
    .regex(/^([a-z\\-]+)$/i, {message: 'O usuário pode ter apenas letras e hífens.'})
    .transform((username) => username.toLowerCase()),
    name: z.string().min(3, {message: 'O nome precisa ter pelo menos 3 letras.'})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register(){

    const router = useRouter()


    const {register, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    })

    async function handleRegister(data: RegisterFormData){
        try {

            await api.post('/users', {
                name: data.name,
                username: data.username
                
            })

            await router.push('/register/connect-calendar')
            
        } catch (error) {

            if (error instanceof AxiosError) {
                
                return alert(error.response?.data.message)
            }
            console.log(error)
        }

    }

    useEffect(() => {
        if (router.query.username) {

            setValue('username', String(router.query.username))
        }

    }, [router.query?.username])

    return (
        <>
         <NextSeo
              title="Crie uma conta | Ignite Call"
              />
        
        <RegisterContainer>
            <Header>
                <Heading as='strong'>Bem-vindo ao Ignite Call!</Heading>
                <Text>Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.</Text>

                <MultiStep size={4} currentStep={1}/>
            </Header>

            <Form onSubmit={handleSubmit(handleRegister)} as='form'>
                <label>
                    <Text size='sm'>Nome de usuário</Text>
                    <TextInput {...register('username')} prefix="ignite.com/" placeholder="seu-usuario"></TextInput>

                    {errors.username && (
                        <FormError size='sm'>{errors.username.message}</FormError>
                    )}
                </label>

                <label>
                    <Text size='sm'>Nome completo</Text>
                    <TextInput {...register('name')} placeholder="Seu nome"></TextInput>
                    {errors.name && (
                        <FormError size='sm'>{errors.name.message}</FormError>
                    )}
                </label>

                <Button disabled={isSubmitting} type="submit">
                    Próximo passo
                    <ArrowRight/>
                </Button>
            </Form>
        </RegisterContainer>
        </>
    )
}