import { multiSwap } from "@/utils/swap-url-values";
import { Button, Grid, Group, NumberInput, Paper } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { NextRouter, Router, useRouter } from "next/router";
import { useState } from "react";

const LoanOptionsForm: React.FC<{}> = () => {
    const router = useRouter()

    const [principal, setPrincipal] = useState<number | ''>(100000);
    const [interest, setInterest] = useState<number | ''>(0.51);
    const [loanStartDate, setLoanStartDate] = useState<Date | null>(new Date());
    const [loanEndDate, setloanEndDate] = useState<Date | null>(new Date());

    console.debug(loanStartDate, "lsd")

    const updateUrl = (router: NextRouter) => {
        multiSwap(router, {
            principal: [principal.toString()],
            rate: [interest.toString()],
            loanStartDate: [loanStartDate?.toDateString() ?? ""],
            loanEndDate: [loanEndDate?.toDateString() ?? ""]
        })
    }

    return (
        <Paper p={"sm"}>
            <Grid>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Initial Principal"
                        value={principal}
                        onChange={setPrincipal}
                        precision={2}
                        min={0}
                        step={1000}
                        max={999999999}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Daily interest rate (% of principal)"
                        value={interest}
                        onChange={setInterest}
                        defaultValue={0.05}
                        precision={2}
                        min={0}
                        step={0.05}
                        max={100}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label="Loan Start Date"
                        value={loanStartDate}
                        onChange={setLoanStartDate}
                        placeholder="Loan Start Date"
                        maw={400}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label="Loan End Date"
                        value={loanEndDate}
                        onChange={setloanEndDate}
                        placeholder="Loan End Date"
                        maw={400}
                    />
                </Grid.Col>
            </Grid>
            <Button my={"sm"} onClick={(event) => updateUrl(router)}>Generate Data</Button>
        </Paper>)
}


export { LoanOptionsForm }

