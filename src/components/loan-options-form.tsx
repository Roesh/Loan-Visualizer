import { multiSwap } from "@/utils/swap-url-values";
import { Button, Grid, Group, NumberInput, Paper } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { NextRouter, Router, useRouter } from "next/router";
import { useEffect, useState } from "react";

const LoanOptionsForm: React.FC<{}> = () => {
    const router = useRouter()

    const { principal, rate, loanStartDate, loanEndDate, } = router.query

    useEffect(() => {
        if (
            router.isReady &&
            (principal === undefined || principal === '') ||
            (rate === undefined || rate === '') ||
            (loanStartDate === undefined || loanStartDate === '') ||
            (loanEndDate === undefined || loanEndDate === '')
        ) {
            const defaultPrincipal = principal || '340000';
            const defaultRate = rate || '0.081';
            const defaultLoanStartDate = loanStartDate || new Date().toDateString();
            const defaultLoanEndDate = loanEndDate || new Date(+new Date() + 1000 * 60 * 60 * 24 * 90).toDateString();

            router.push({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    principal: defaultPrincipal,
                    rate: defaultRate,
                    loanStartDate: defaultLoanStartDate,
                    loanEndDate: defaultLoanEndDate,
                },
            });
        }
    }, [router])


    return (
        <Paper p={"sm"}>
            <Grid>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Initial Principal"
                        value={Number(principal)}
                        onChange={(value) =>
                            multiSwap(router, {
                                principal: [value.toString()]
                            })}
                        precision={2}
                        min={0}
                        step={1000}
                        max={999999999}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Daily interest rate (% of principal)"
                        value={Number(rate)}
                        onChange={(value) =>
                            multiSwap(router, {
                                rate: [value.toString()]
                            })}
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
                        value={loanStartDate ? new Date(loanStartDate as string) : undefined}
                        onChange={(value) =>
                            multiSwap(router, {
                                loanStartDate: [value?.toDateString() ?? ""]
                            })}
                        placeholder="Loan Start Date"
                        maw={400}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label="Loan End Date"
                        value={loanEndDate ? new Date(loanEndDate as string) : undefined}
                        onChange={(value) =>
                            multiSwap(router, {
                                loanEndDate: [value?.toDateString() ?? ""]
                            })}
                        placeholder="Loan End Date"
                        maw={400}
                    />
                </Grid.Col>
            </Grid>
        </Paper>)
}


export { LoanOptionsForm }

