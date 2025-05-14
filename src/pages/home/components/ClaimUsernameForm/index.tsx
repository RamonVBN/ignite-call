import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import {ArrowRight} from 'phosphor-react'
import { useForm } from "react-hook-form";
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useRouter } from "next/router";
import { type TextInputProps } from "@ignite-ui/react";


const claimUsernameFormSchema = z.object({
    username: z.string()
    .min(3, {message: 'O usuário precisa ter pelo menos 3 caracteres.'})
    .regex(/^([a-z\\-]+)$/i, {message: 'O usuário pode ter apenas letras e hífens.'})
    .transform((username) => username.toLowerCase())
})

type ClaimUsernameData = z.infer<typeof claimUsernameFormSchema>

type InputProps = TextInputProps | undefined

export function ClaimUsernameForm(props: InputProps){

    const router = useRouter()

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<ClaimUsernameData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    async function handleClaimUsername(data: ClaimUsernameData){
        const {username} = data

        await router.push(`/register?username=${username}`)

    }

    return (
        <>
        <Form onSubmit={handleSubmit(handleClaimUsername)} as='form'>
            <TextInput {...props} required {...register('username')} size='sm' prefix="ignite.com/" placeholder="seu-usuário"/>
            <Button type="submit" disabled={isSubmitting}>
                Reservar
                <ArrowRight/>
            </Button>

        </Form>
            <FormAnnotation>

                <Text size='sm'>{errors.username? errors.username?.message: 'Digite seu nome de usuário.'}</Text>
                
            </FormAnnotation>
        </>
    )
}