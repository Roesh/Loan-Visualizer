import React from "react";
import { IAmountDateDataPoint } from "./time-series-chart";
import { dateFormat } from "@/utils/date-format";
import { Card } from "@mantine/core";
import { amountFormatter, amountTickFormatter } from "@/utils/amount-format";

const style = {
  padding: "3rem",
};

const LoanAmountToolTip = (props: any) => {
  const { active, payload } = props;
  const data: IAmountDateDataPoint = payload?.[0]?.payload
  
  if (active && data) {
    // const currData = payload && payload.length ? payload[0].payload : null;
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <p>{dateFormat(data.date)}</p>
        ---
        <p>Total: {amountFormatter(data.principal + data.interest, true)}</p>
        <p>Principal:  {amountFormatter(data.principal, true)}</p>
        <p>Interest: {amountFormatter(data.interest, true)}</p>
        {(data.payment > 0) && <p>Payment: {amountFormatter(data.payment, true)}</p>}

      </Card>)
    //   <div className="area-chart-tooltip" style={style}>
    //     <p>
    //       {currData ? format(new Date(currData.date), "yyyy-MM-dd") : " -- "}
    //     </p>
    //     <p>
    //       {"value : "}
    //       <em>{currData ? currData.val : " -- "}</em>
    //     </p>
    //   </div>
    // );
  }
  return null
};

export default LoanAmountToolTip;
