import { useState } from "react";
import { CalendarStep } from "./CalendarStep";
import { ConfirmStep } from "./ConfirmStep";

export function ScheduleForm(){

    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

    if (selectedDateTime) {

        return (
        <ConfirmStep onCancelConfirmation={handleClearSelectedDateTime} schedulingDate={selectedDateTime} />
    )
    }

    function handleClearSelectedDateTime(){

        setSelectedDateTime(null)
    }

    return (
        <CalendarStep onSelectedDateTime={setSelectedDateTime} ></CalendarStep>
    )
}