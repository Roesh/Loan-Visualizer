import React, { Dispatch, SetStateAction, useState } from 'react';
import { Card, Paper } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';

export interface IDateRange {
    start: Date | null,
    end: Date | null
}

export const DateRangeSelector: React.FC<{ dateRange: IDateRange, setDateRange: Dispatch<SetStateAction<IDateRange>> }> = ({ dateRange, setDateRange }) => {
    // const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Paper>
            Select Graph Date Range
            <div style={{display: "flex"}}>
                <DateInput
                    value={dateRange?.start}
                    onChange={(start) => setDateRange({ ...dateRange, start })}
                    placeholder="Date Range Start"
                    maw={400}
                    mx="sm"
                    my="sm"
                />
                <DateInput
                    value={dateRange?.end}
                    onChange={(end) => setDateRange({ ...dateRange, end })}
                    placeholder="Date Range End"
                    maw={400}
                    mx="sm"
                    my="sm"
                />
            </div>
        </Paper>
    );
}