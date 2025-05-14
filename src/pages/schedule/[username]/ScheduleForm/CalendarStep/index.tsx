import { Calendar } from "@/components/Calendar";
import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from "./styles";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface AvailabilityProps {
    possibleTimes: number[]
    availableTimes: number[]
}

interface CalendarStepProps {

    onSelectedDateTime: (date: Date) => void
}

export function CalendarStep({onSelectedDateTime}: CalendarStepProps){

    const router = useRouter()

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    // const [availability, setAvailability] = useState<AvailabilityProps | null>(null)

    const isDateSelected = !!selectedDate
    const username = String(router.query.username)

    const weekDay = selectedDate? dayjs(selectedDate).format('dddd') : null
    const describedDate = selectedDate? dayjs(selectedDate).format('DD[ de ]MMMM') : null

    const selectedDateWithoutTime = selectedDate? dayjs(selectedDate).format('YYYY-MM-DD'): null

    const {data: availability} = useQuery<AvailabilityProps>({
        queryKey: ['availability', selectedDateWithoutTime],
        queryFn: async () => {

            const response = await api.get(`/users/${username}/availability`, {
                params: {
                    date: dayjs(selectedDate).format('YYYY-MM-DD'),
                    timezoneOffset: selectedDate? selectedDate.getTimezoneOffset(): 0
                }
            })

            return response.data
        },
        enabled: !!selectedDate
    })

    function handleSelectTime(hour : number){

        const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()

        onSelectedDateTime(dateWithTime)
    }

    return (
        <Container isTimePickerOpen={isDateSelected}>
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate}/>

            {isDateSelected &&
            <TimePicker>

                <TimePickerHeader>
                    {weekDay}, <span>{describedDate}</span>
                </TimePickerHeader>
                <TimePickerList>
                    {availability && availability.possibleTimes.map((time) => {
                        return (
                            <TimePickerItem onClick={() => handleSelectTime(time)} key={time} disabled={!availability.availableTimes.includes(time)} >{String(time).padStart(2, '0')}:00h</TimePickerItem>
                        )
                    })}
                       
                </TimePickerList>
            </TimePicker>
            }
        </Container>
    )
}