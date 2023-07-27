import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import TimeSeriesChart, { IAmountDateDataPoint } from '@/components/time-series-chart'
import { DateRangeSelector, IDateRange } from '@/components/date-range-selector'
import { useState } from 'react'
import { LoanOptionsForm } from '@/components/loan-options-form'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<IDateRange>({ start: new Date(), end: new Date() })
  const domain = [new Date(dateRange.start ?? 0).getTime(), new Date(dateRange.end ?? 0).getTime()]

  const { principal, rate, intervalType, loanStartDate, loanEndDate, startDate, endDate } = router.query;

  const data = generateGraphData(Number(principal), new Date(loanStartDate as string), new Date(loanEndDate as string), Number(rate)) ?? []

  return (
    <>
      <Head>
        <title>Loan Visualizer</title>
        <meta name="description" content="Tool to visualize the amount generated by a loan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <TimeSeriesChart chartData={data} domain={domain} />
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        <LoanOptionsForm />
      </main>
    </>
  )
}

const generateGraphData = (initialPrincipal: number, loanStartDate: Date, loanEndDate: Date, dailyInterestRate: number) => {
  const startDateStamp = getZeroedDateStamp(loanStartDate)
  const endDateStamp = getZeroedDateStamp(loanEndDate)

  if (startDateStamp > endDateStamp) {
    alert("Start Date cannot be after end date")
    return;
  }

  const data: IAmountDateDataPoint[] = []
  let currentTimeStamp = startDateStamp
  let currentPrincipal = initialPrincipal
  let currentInterest = 0

  for (; currentTimeStamp < endDateStamp; currentTimeStamp = getNextDayTimeStamp(currentTimeStamp)) {

    const newData = {
      date: currentTimeStamp,
      interest: (dailyInterestRate * 100) * (currentInterest + currentPrincipal),
      principal: currentPrincipal,
      total: 0
    }
    newData.total = newData.interest + newData.principal

    data.push(newData)
    currentPrincipal = newData.principal
    currentInterest = newData.interest
  }

  console.debug(data, "loan data")
  return data
}

const getNextDayTimeStamp = (timestamp: number) => {
  const nextDate = timestamp + 1000 * 60 * 60 * 24
  return nextDate
}

const getZeroedDateStamp = (date: Date) => {
  const newDate = new Date(2020, 1, 1)
  newDate.setFullYear(date.getFullYear())
  newDate.setMonth(date.getMonth())
  newDate.setDate(date.getDate())
  return newDate.getTime()
}