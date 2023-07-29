import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import TimeSeriesChart, { IAmountDateDataPoint } from '@/components/time-series-chart'
import { DateRangeSelector, IDateRange } from '@/components/date-range-selector'
import { Dispatch, SetStateAction, useState } from 'react'
import { LoanOptionsForm } from '@/components/loan-options-form'
import { PaymentSchedule } from '@/components/payment-schedule'
import { Box, Button, LoadingOverlay, Progress } from '@mantine/core'
import { setegid } from 'process'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<IDateRange>({ start: new Date(), end: new Date() })
  const [data, setData] = useState<IAmountDateDataPoint[]>([])
  const [generating, setGenerating] = useState<boolean>(false)
  const [generationPercent, setGenerationPercent] = useState(0)

  const domain = [new Date(dateRange.start ?? 0).getTime(), new Date(dateRange.end ?? 0).getTime()]

  const { principal, rate, intervalType, loanStartDate, loanEndDate, startDate, endDate
    , scale, paymentAmount, applyFirst } = router.query;

  const generateGraphData = async (initialPrincipal: number, loanStartDate: Date,
    loanEndDate: Date, dailyInterestRate: number, scale: "constant" | "linear",
    paymentAmount: number, applyFirst: string, setGenerationPercent: Dispatch<SetStateAction<number>>
  ) => {
    const startDateStamp = getZeroedDateStamp(loanStartDate)
    const endDateStamp = getZeroedDateStamp(loanEndDate)

    const totalTimeSpan = endDateStamp - startDateStamp;
    const initialTime = startDateStamp;

    if (startDateStamp > endDateStamp) {
      alert("Start Date cannot be after end date")
      return;
    }

    const data: IAmountDateDataPoint[] = []

    const sparseData: IAmountDateDataPoint[] = []
    const returnSparseData = timeDifferenceIsGreaterThanThreeYears(startDateStamp, endDateStamp)

    let currentTimeStamp = startDateStamp
    let currentPrincipal = initialPrincipal
    let currentInterest = 0
    let currentTotalPayment = 0

    let firstDataPoint = {
      date: currentTimeStamp,
      interest: 0,
      principal: currentPrincipal,
      total: currentPrincipal,
      payment: 0,
      totalPayment: 0
    }

    if (isDateOnFirstDayOfMonth(currentTimeStamp)) {
      firstDataPoint = processPayment(firstDataPoint, scale, paymentAmount, applyFirst)
    }

    data.push(firstDataPoint)
    sparseData.push(firstDataPoint)

    currentTimeStamp = getNextDayTimeStamp(currentTimeStamp)

    let newData = firstDataPoint
    let newInterestAccrued

    for (; currentTimeStamp < endDateStamp; currentTimeStamp = getNextDayTimeStamp(currentTimeStamp)) {

      newInterestAccrued = currentInterest + ((currentPrincipal + currentInterest) * (dailyInterestRate / 100))

      newData = {
        date: currentTimeStamp,
        interest: newInterestAccrued,
        principal: currentPrincipal,
        total: (currentPrincipal + newInterestAccrued),
        payment: 0,
        totalPayment: currentTotalPayment
      }

      if (isDateOnFirstDayOfMonth(currentTimeStamp)) {
        newData = processPayment(newData, scale, paymentAmount, applyFirst)
        returnSparseData && sparseData.push(newData)
        console.debug(newData, "1st of month")
      }

      data.push(newData)
      currentPrincipal = newData.principal
      currentInterest = newData.interest
      currentTotalPayment = newData.totalPayment

      if (currentPrincipal + currentInterest <= 0) {
        data.push({...newData, date: newData.date + 1000 * 60 * 60 * 24 * 60})
        sparseData.push({...newData, date: newData.date + 1000 * 60 * 60 * 24 * 60})
        break;
      }

      const elapsedTime = currentTimeStamp - initialTime;
      const progressPercent = Number(((elapsedTime / totalTimeSpan) * 100).toFixed(0));

      // Update the progress percentage only if it has changed (throttling)
      if (progressPercent !== generationPercent) {
        console.debug(progressPercent)
        setGenerationPercent(progressPercent);
      }
    }

    // console.debug(data, "loan data")
    return returnSparseData ? sparseData : data
  }

  const createGraphData = async () => {
    setGenerating(true)
    setGenerationPercent(0);

    setTimeout(async () => {
      try {
        setData(await generateGraphData(
          Number(principal),
          new Date(loanStartDate as string),
          new Date(loanEndDate as string),
          Number(rate),
          scale as "constant",
          Number(paymentAmount),
          applyFirst as "interest",
          setGenerationPercent
        ) ?? []);
      } catch (ex) {
        console.debug(ex);
      } finally {
        setGenerating(false);
        setGenerationPercent(0);
      }
    }, 0);


  };

  return (
    <>
      <Head>
        <title>Loan Visualizer</title>
        <meta name="description" content="Tool to visualize the amount generated by a loan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Box maw={'90%'} pos="relative">
          <LoadingOverlay visible={generating} overlayBlur={2} overlayOpacity={0.3} overlayColor="#c5c5c5" />
          <TimeSeriesChart chartData={data} domain={domain} />
          <Button my={"sm"} onClick={createGraphData} disabled={generating}>Generate Data</Button>
          {/* {generating && <Progress value={generationPercent} />} */}
          {/* <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} /> */}
          <LoanOptionsForm />
          <PaymentSchedule />
        </Box>

      </main >
    </>
  )
}

const timeDifferenceIsGreaterThanThreeYears = (startTimeStamp: number, endTimeStamp: number) => {
  // Calculate the number of milliseconds in three years
  const threeYearsInMilliseconds = 3 * 365 * 24 * 60 * 60 * 1000;
  return ((endTimeStamp - startTimeStamp) > threeYearsInMilliseconds)
}

const getNextDayTimeStamp = (timestamp: number) => {
  const nextDate = timestamp + 1000 * 60 * 60 * 24
  return nextDate
}

const getZeroedDateStamp = (date: Date) => {
  const newDate = new Date(Date.UTC(2020, 1, 1))
  newDate.setFullYear(date.getFullYear())
  newDate.setMonth(date.getMonth())
  newDate.setDate(date.getDate())
  return newDate.getTime()
}

const isDateOnFirstDayOfMonth = (timestamp: number) => {
  const date = new Date(new Date(timestamp).toUTCString());
  return date.getDate() === 1;
};

/** Mutates data */
const processPayment = (data: IAmountDateDataPoint, scale: "constant" | "linear",
  paymentAmount: number, applyFirst: string
) => {

  data.payment = paymentAmount
  data.totalPayment = data.totalPayment + paymentAmount

  let remainder = 0
  let interestLeft = data.interest
  let principalLeft = data.principal

  if (applyFirst === "interest") {
    remainder = interestLeft - paymentAmount
    if (remainder < 0) {
      data.interest = 0
      data.principal = principalLeft + remainder
    } else {
      data.interest = remainder
    }
  }

  if (applyFirst === "principal") {
    remainder = principalLeft - paymentAmount
    if (remainder < 0) {
      data.principal = 0
      data.interest = interestLeft + remainder
    } else {
      data.principal = remainder
    }
  }

  data.total = data.principal + data.interest

  return data
}