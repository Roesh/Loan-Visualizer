// Custom debounce function
//@ts-ignore
export const debounce = (callback, delay) => {
    //@ts-ignore
    let timeoutId;
    //@ts-ignore
    return (...args) => {
        //@ts-ignore
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};