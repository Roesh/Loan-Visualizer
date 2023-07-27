import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import PropTypes from "prop-types";
import exp from "constants";
import LoanAmountToolTip from "./tooltip";
import { dateFormat } from "@/utils/date-format";
import { amountTickFormatter } from "@/utils/amount-format";

export interface IAmountDateDataPoint {
    total: number,
    principal: number,
    interest: number,
    date: number
}

const TimeSeriesChart = ({ chartData, domain }: { chartData: IAmountDateDataPoint[] , domain: number[]}) => {
    // const domain = [new Date(2023, 7, 15).getTime(), new Date(2023, 7, 24).getTime()]
    return <ResponsiveContainer width="80%" height={200}>
        <AreaChart
            width={900}
            height={250}
            data={chartData}
            margin={{
                top: 10,
                right: 0,
                bottom: 10,
                left: 0
            }}
        >
            <XAxis
                dataKey="date"
                scale="time"
                tickFormatter={dateFormat}
                type="number"
                domain={domain}
            />
            <YAxis dataKey="total" tickFormatter={amountTickFormatter}/>
            <Tooltip content={<LoanAmountToolTip />} />
            <Area
                type="monotone"
                dataKey="total"
                stroke="#ff7300"
                fill="#ff7300"
                fillOpacity={0.9}
            />
        </AreaChart>
    </ResponsiveContainer>
};

TimeSeriesChart.propTypes = {
    chartData: PropTypes.arrayOf(
        PropTypes.shape({
            time: PropTypes.number,
            value: PropTypes.number,
        })
    ).isRequired,
};

// const getDateFmt = (unixTimestamp) => {
//     const date = new Date(unixTimestamp);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();

//     const minuteString = minutes < 10 ? "0" + minutes : minutes;

//     let hourMin = "";

//     if (hours > 12) {
//         hourMin = `${hours - 12}:${minuteString} pm`;
//     } else {
//         hourMin = `${hours}:${minuteString} am`;
//     }
//     return `${hourMin}, ${date.getDate()}th ${monthNumberToNameMap[date.getMonth()]
//         }`;
// };

const monthNumberToNameMap = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
};
export default TimeSeriesChart;