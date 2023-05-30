import { Button } from "@chakra-ui/react"
import TimeSelector from "@components/TimeSelector"
import { Switch } from "@headlessui/react"
import { Day } from "@prisma/client"
import { formatISO } from "date-fns"
import { FC, useState } from "react"
import Calendar, { calendar } from "react-calendar"
import toast, { Toaster } from "react-hot-toast"
import { now } from "n/constants/config"
import { capitalize, ClassNames, weekdayIndexToName } from "n/utils/helper"
import { trpc } from "n/utils/trpc"
import { prisma } from "n/server/db/client"

interface openingProps {
  days: Day[]
}

const opening: FC<openingProps> = ({ days }) => {
  const [enabled, setEnabled] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [openingHrs, setOpeningHrs] = useState([
    {
      name: "sunday",
      openTime: days[0]!.openTime,
      closeTime: days[0]!.closeTime,
    },
    {
      name: "monday",
      openTime: days[1]!.openTime,
      closeTime: days[1]!.closeTime,
    },
    {
      name: "tuesday",
      openTime: days[2]!.openTime,
      closeTime: days[2]!.closeTime,
    },
    {
      name: "wednesday",
      openTime: days[3]!.openTime,
      closeTime: days[3]!.closeTime,
    },
    {
      name: "thursday",
      openTime: days[4]!.openTime,
      closeTime: days[4]!.closeTime,
    },
    {
      name: "friday",
      openTime: days[5]!.openTime,
      closeTime: days[5]!.closeTime,
    },
    {
      name: "saturday",
      openTime: days[6]!.openTime,
      closeTime: days[6]!.closeTime,
    },
  ])

  // tRPC
  const { mutate: saveOpeningHrs, isLoading } =
    trpc.opening.changeOpeningHours.useMutation({
      onSuccess: () => toast.success("Opening hours saved"),
      onError: () => toast.error("Something went wrong"),
    })
  const { mutate: closeDay } = trpc.opening.closeDay.useMutation({
    onSuccess: () => refetch(),
  })
  const { mutate: openDay } = trpc.opening.openDay.useMutation({
    onSuccess: () => refetch(),
  })
  const { data: closedDays, refetch } = trpc.opening.getClosedDays.useQuery()

  const dayIsCLosed =
    selectedDate && closedDays?.includes(formatISO(selectedDate))

  // Curried for easier usage
  function _changeTime(day: Day) {
    return function (time: string, type: "openTime" | "closeTime") {
      const index = openingHrs.findIndex(
        (x) => x.name === weekdayIndexToName(day.dayOfWeek)
      )
      const newOpeningHrs = [...openingHrs]
      newOpeningHrs[index]![type] = time
      setOpeningHrs(newOpeningHrs)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Toaster />
      <div className="mt-6 flex justify-center gap-6">
        <p className={`${!enabled ? "font-medium" : ""}`}>Opening times</p>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? "bg-indigo-600" : "bg-gray-200",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-2"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none right-0 inline-block h-5 w-5 transform rounded-full bg-white shadow"
            )}
          />
        </Switch>
        <p className={`${enabled ? "font-medium" : ""}`}>Opening days</p>
      </div>
      {!enabled ? (
        // Openings times options
        <div className="my-12 flex flex-col gap-8">
          {days.map((day) => {
            const changeTime = _changeTime(day)
            return (
              <div className="grid grid-cols-3 place-items-center" key={day.id}>
                <h3 className="font-semibold">
                  {capitalize(weekdayIndexToName(day.dayOfWeek))}
                </h3>
                <div className="mx-4">
                  <TimeSelector
                    type="openTime"
                    changeTime={changeTime}
                    selected={
                      openingHrs[
                        openingHrs.findIndex(
                          (x) => x.name === weekdayIndexToName(day.dayOfWeek)
                        )
                      ]?.openTime
                    }
                  />
                </div>
                <div className="mx-4">
                  <TimeSelector
                    type="closeTime"
                    changeTime={changeTime}
                    selected={
                      openingHrs[
                        openingHrs.findIndex(
                          (x) => x.name === weekdayIndexToName(day.dayOfWeek)
                        )
                      ]?.closeTime
                    }
                  />
                </div>
              </div>
            )
          })}

          <Button
            onClick={() => {
              const withId = openingHrs.map((day) => ({
                ...day,
                id: days[days.findIndex((d) => d.name === day.name)]!.id,
              }))

              saveOpeningHrs(withId)
            }}
            isLoading={isLoading}
            colorScheme="green"
            variant="solid"
          >
            save
          </Button>
        </div>
      ) : (
        // Opening days options
        <div className="mt-6 flex flex-col items-center gap-6">
          <Calendar
            minDate={now}
            className="REACT-CALENDAR p-2"
            view="month"
            onClickDay={(date) => setSelectedDate(date)}
            titleClassName={({ activeStartDate, date, view }) => {
              return closeDays?.includes(formatISO(date)) ? "closed-day" : null
            }}
          />
          <Button
            onClick={() => {
              if (dayIsCLosed) openDay({ date: selectedDate })
              else if (selectedDate) closeDay({ date: selectedDate })
            }}
            disabled={!selectedDate}
            isLoading={isLoading}
            colorScheme="green"
            variant="solid"
          >
            {dayIsCLosed ? "Open shop this day" : "Close shop this day"}
          </Button>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  const days = await prisma.day.findMany()

  if (!(days.length === 7)) throw new Error("Insert all days into database")

  return { props: { days } }
}
export default opening
