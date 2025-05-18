import moment from "moment"

export const useDateParse = (date: string, format: string = 'Do MMMM') => {
    return moment(date).format(format)
}