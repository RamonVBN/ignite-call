import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";
import { TypeOf, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
    name: z.string().min(3, {message: 'O nome precisa no mínimo 3 caracteres.'}),
    email: z.string().email({message: 'Digite um email válido.'}),
    observations: z.string().nullable()
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps{
    schedulingDate: Date
    onCancelConfirmation: () => void
}

export function ConfirmStep({schedulingDate, onCancelConfirmation}: ConfirmStepProps){

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })

    const router = useRouter()

    const username = String(router.query.username)

    async function handleConfirmScheduling(data: ConfirmFormData){

        const {name, email, observations} = data
        
        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate
        })

        onCancelConfirmation()
    }

    const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY ')
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

    console.log(username)

    return ( 
        <ConfirmForm as='form' onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank/>
                    {describedDate}
                </Text>
                <Text>
                    <Clock/>
                    {describedTime}
                </Text>
            </FormHeader>
        
            <label>
                <Text size='sm'>Nome completo</Text>
                <TextInput {...register('name')} placeholder="Seu nome"/>
                {errors.name && (
                    <FormError size='sm'>{errors.name.message}</FormError>
                )}
            </label>

            <label>
                <Text size='sm'>Endereço de e-mail</Text>
                <TextInput {...register('email')} placeholder="seu@email.com"/>
                {errors.email && (
                    <FormError size='sm'>{errors.email.message}</FormError>
                )}
            </label>

            <label>
                <Text size='sm'>Observações</Text>
                <TextArea {...register('observations')} />
            </label>

            <FormActions>
                <Button onClick={() => onCancelConfirmation()} type="button" variant='tertiary' >Cancelar</Button>
                <Button disabled={isSubmitting} type="submit">Confirmar</Button>
            </FormActions>

        </ConfirmForm>
    )
}