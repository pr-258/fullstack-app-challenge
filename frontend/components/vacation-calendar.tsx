"use client"

import { useMemo, useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addDays } from "date-fns"
import { pt } from "date-fns/locale"

import type { VacationRequest } from "@/types/api"

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { pt },
})

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: VacationRequest
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const STATUS_STYLES: Record<string, { backgroundColor: string; borderColor: string }> = {
  APPROVED: { backgroundColor: "#10b981", borderColor: "#059669" },
  PENDING:  { backgroundColor: "#f59e0b", borderColor: "#d97706" },
}

type VacationCalendarProps = {
  requests: VacationRequest[]
  onSelectEvent: (request: VacationRequest) => void
}

export function VacationCalendar({ requests, onSelectEvent }: VacationCalendarProps) {
  const [date, setDate] = useState(new Date())

  const events = useMemo<CalendarEvent[]>(
    () =>
      requests.map((req) => ({
        id: req.id,
        title: req.collaboratorName,
        start: parseLocalDate(req.startDate),
        end: addDays(parseLocalDate(req.endDate), 1),
        resource: req,
      })),
    [requests]
  )

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      culture="pt"
      views={["month"]}
      defaultView="month"
      date={date}
      onNavigate={setDate}
      style={{ height: 640 }}
      onSelectEvent={(event) => onSelectEvent((event as CalendarEvent).resource)}
      eventPropGetter={(event) => ({
        style: STATUS_STYLES[(event as CalendarEvent).resource.status] ?? STATUS_STYLES.PENDING,
      })}
      formats={{
        monthHeaderFormat: (date, culture, localizer) => {
          const str = localizer?.format(date, "MMMM yyyy", culture) ?? ""
          return str.charAt(0).toUpperCase() + str.slice(1)
        },
      }}
      messages={{
        next: "Próximo",
        previous: "Anterior",
        today: "Hoje",
        month: "Mês",
        noEventsInRange: "Sem pedidos neste período.",
        showMore: (total) => `+${total} mais`,
      }}
    />
  )
}
