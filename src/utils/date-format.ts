export const dateFormat = (date: number) => {
    return new Date(date).toLocaleDateString(undefined, { dateStyle: "medium" })
};