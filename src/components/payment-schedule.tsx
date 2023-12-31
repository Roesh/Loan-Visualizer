import { debounce } from "@/utils/debounce";
import { multiSwap } from "@/utils/swap-url-values";
import { Button, Grid, NumberInput, Paper, Select } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

const PaymentSchedule: React.FC<{}> = () => {
    const router = useRouter()
    const { scale, paymentAmount, applyFirst } = router.query

    useEffect(() => {
        if (
            router.isReady &&
            (scale === undefined || scale === '') ||
            (paymentAmount === undefined || paymentAmount === '') ||
            (applyFirst === undefined || applyFirst === '')
        ) {
            const defaultScale = scale || 'constant';
            const defaultPaymentAmount = paymentAmount || '3000';
            const defaultApplyFirst = applyFirst || 'interest';

            router.push({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    scale: defaultScale,
                    paymentAmount: defaultPaymentAmount,
                    applyFirst: defaultApplyFirst,
                },
            });
        }
    }, [router])
    
    return <Paper my={"md"} p="sm">
        <PaymentLine
            scale={router?.query?.scale as 'constant' ?? 'constant'}
            paymentAmount={Number(router?.query?.paymentAmount ?? 1000)}
            applyFirst={router?.query?.applyFirst as string ?? 'interest'}
            router={router}
        />
    </Paper>
}

const PaymentLine: React.FC<{
    scale: 'constant' | 'linear',
    paymentAmount: number,
    applyFirst: string,
    router: NextRouter
}> = ({ scale, paymentAmount, applyFirst, router }) => {

    // Debounced function to update the specified query parameter
    const debouncedUpdateQueryParam = useCallback(
        debounce((key: string, value: string | number) => {

        console.debug("setting")
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
        <Grid>
            <Grid.Col span={4}>
                <Select
                    label="Payment Schedule"
                    value={scale}
                    onChange={(value) => handleInputChange('scale', value ?? 'constant')}
                    data={[
                        { value: 'constant', label: 'Constant Payments (1st of month)' },
                        { value: 'linear', label: 'Linear Ramp' },
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={4}>
                <Select
                    label="Apply payment first toward"
                    value={applyFirst}
                    onChange={(value) => handleInputChange('applyFirst', value ?? 'interest')}
                    data={[
                        { value: 'interest', label: 'Interest' },
                        { value: 'principal', label: 'Principal' },
                    ]}
                />
            </Grid.Col>
            <Grid.Col span={4}>
                <NumberInput
                    label="Payment amount"
                    value={paymentAmount}
                    onChange={(value) => handleInputChange('paymentAmount', value)}
                    precision={2}
                    min={0}
                    step={100}
                    max={999999999}
                />
            </Grid.Col>
        </Grid>
    )
}

export { PaymentSchedule }