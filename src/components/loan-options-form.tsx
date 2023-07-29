import { debounce } from "@/utils/debounce";
import { multiSwap } from "@/utils/swap-url-values";
import { Button, Grid, Group, NumberInput, Paper } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { NextRouter, Router, useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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

    // Debounced function to update the specified query parameter
    const debouncedUpdateQueryParam = useCallback(
        debounce((key: string, value: string | number) => {
            multiSwap(router, {
                [key]: [value.toString()],
            });
        }, 500),
        [router]
    );

    const handleInputChange = (key: string, value: string | number) => {
        debouncedUpdateQueryParam(key, value);
    };

    return (
        <Paper p={"sm"}>
            <Grid>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Initial Principal"
                        value={Number(router?.query?.principal)}
                        onChange={(value) => handleInputChange('principal', value)}
                        precision={2}
                        min={0}
                        step={1000}
                        max={999999999}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <NumberInput
                        label="Daily interest rate (%)"
                        value={Number(router?.query?.rate)}
                        onChange={(value) => handleInputChange('rate', value)}
                        defaultValue={0.05}
                        precision={5}
                        min={0}
                        step={0.05}
                        max={100}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label="Loan Start Date"
                        value={router?.query?.loanStartDate ? new Date(router?.query?.loanStartDate as string) : undefined}
                        onChange={(value) => handleInputChange('loanStartDate', value?.toDateString() ?? '')}
                        placeholder="Loan Start Date"
                        maw={400}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label="Loan End Date"
                        value={router?.query?.loanEndDate ? new Date(router?.query?.loanEndDate as string) : undefined}
                        onChange={(value) => handleInputChange('loanEndDate', value?.toDateString() ?? '')}
                        placeholder="Loan End Date"
                        maw={400}
                    />
                </Grid.Col>
            </Grid>
        </Paper>)
}


export { LoanOptionsForm }

