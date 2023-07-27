import { swapkeys } from "@/types";
import { NextRouter } from "next/router";

const singleSwap: (
    router: NextRouter,
    swapKey: swapkeys,
    swapValues: string[]
) => Promise<boolean> = async (router, swapKey, swapValues) => {
    const queryStr = router.query;
    queryStr[swapKey] = swapValues;

    return router.push({
        pathname: router.pathname,
        query: queryStr,
    });
};

const multiSwap: (
    router: NextRouter,
    swapValuesMap: { [key in swapkeys]?: string[] }
) => Promise<boolean> = async (router, swapValuesMap) => {
    const queryStr = router.query;
    //@ts-ignore
    Object.keys(swapValuesMap).forEach((key) => (queryStr[key] = swapValuesMap[key]));

    return router.push({
        pathname: router.pathname,
        query: queryStr,
    });
};

export { singleSwap, multiSwap };