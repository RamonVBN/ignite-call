import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Header, RegisterContainer } from "../styles";
import { FormError, IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./styles";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {z} from 'zod'
import { getWeekDays } from "@/utils/get-week-days";
import {zodResolver} from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const timeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string()
    }))
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {message: 'Você precisa selecionar pelo menos um dia da semana!'})
    .transform((intervals) => {
        return intervals.map((interval) => {
            return {
                weekDay: interval.weekDay,
                startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
                endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
            }
        })
    })
    .refine((intervals) => {
        return intervals.every((interval) => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes)
    }, {message: 'O horário do término deve ser pelo menos de 1h distante do início'})

})

type TimeIntervalsInput  = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsOutput = z.output<typeof timeIntervalsFormSchema>

export default function Register(){

    const router = useRouter()

    const {register, control, handleSubmit, watch, formState: {errors, isSubmitting}} = useForm<TimeIntervalsInput, unknown, TimeIntervalsOutput>({
        defaultValues: {
            intervals: [
                {weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00'},
                {weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00'}
            ]
        },
        resolver: zodResolver(timeIntervalsFormSchema)
    })

    const weekDays = getWeekDays({short: false})

    const {fields} = useFieldArray({
        control,
        name: 'intervals',

    })

    const intervals = watch('intervals')
    
    async function handleSetTimeIntervals(data: TimeIntervalsOutput){

        await api.post('/users/time-intervals', data)

        await router.push('/register/update-profile')

    }


    return (
        <>
         <NextSeo
            title="Selecione sua disponibilidade | Ignite Call"
            noindex
         />
       
        <RegisterContainer>
            <Header>
                <Heading as='strong'>Defina sua disponibilidade</Heading>
                <Text>Defina o intervalo de horários que você está disponível em cada dia da semana.</Text>

                <MultiStep size={4} currentStep={3}/>
            </Header>

            <IntervalBox onSubmit={handleSubmit(handleSetTimeIntervals)} as='form' >

                <IntervalsContainer>

                    {fields.map((field, index) => {
                        return (
                            <IntervalItem key={field.id} >
                            <IntervalDay>
                                <Controller
                                name={`intervals.${index}.enabled`}
                                control={control}
                                render={({field}) => {
                                    return (
                                        <Checkbox onCheckedChange={(checked) => {
                                            field.onChange(checked === true)
                                        }}
                                        checked={field.value}
                                        />
                                    )
                                }}
                                />
                                <Text>{weekDays[field.weekDay]}</Text>
                            </IntervalDay>
                            <IntervalInputs>
                                <TextInput disabled={intervals[index].enabled === false} {...register(`intervals.${index}.startTime`)} type='time' step={60} size='sm'/>
                                <TextInput disabled={intervals[index].enabled === false} {...register(`intervals.${index}.endTime`)} type='time' step={60} size='sm'/>
                            </IntervalInputs>
                        </IntervalItem>
    
                        )
                    })}
                  
                </IntervalsContainer>
                
                {errors.intervals && (
                    <FormError size='sm'>
                        {errors.intervals.root?.message}
                    </FormError>
                )}
                <Button disabled={isSubmitting} type="submit">
                    Próximo Passo
                    <ArrowRight/>
                </Button>
            </IntervalBox>
        </RegisterContainer>
        </>
    )
}