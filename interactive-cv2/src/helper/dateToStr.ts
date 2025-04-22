/**
 * Converts a date object to a string in the format "Month (truncated) Year".
 * Example: 01/01/2021 -> "Jan '21"
 * 
 * @param {Date} date - The date to convert
 * @returns {string} - The formatted date string
 */
function dateToStr(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Calculates the duration between two dates and returns a string in the format 
 * "Month (truncated) Year - Month (truncated) Year | Xyr Ymo".
 * Example: 01/01/2021 - 01/01/2022 -> "Jan '21 - Feb '22 | 1yr 1mo"
 * 
 * @param {Date | string} start - The start date
 * @param {Date | string | undefined} end - The end date (optional)
 * @returns {string} - The formatted date range and duration string
 */
function calculateDateRange(start: Date | string, end?: Date | string): string {
    // Convert inputs to Date objects
    const startDate = new Date(start);
    let endDate: Date;
    let isPresent = false;

    if (!end) {
        endDate = new Date();
        isPresent = true;
    } else {
        endDate = new Date(end);
    }

    // Calculate the duration between two dates
    const duration = endDate.getTime() - startDate.getTime();
    const durationInMonths = duration / (1000 * 60 * 60 * 24 * 30.44); // Average days in a month
    const years = Math.floor(durationInMonths / 12);
    const months = Math.floor(durationInMonths % 12);

    // Convert the dates to strings
    const startStr = dateToStr(startDate);
    const endStr = isPresent ? 'Present' : dateToStr(endDate);

    const dateRangeStr = `${startStr} - ${endStr}`;
    const durationStr = `${years}yr${months > 0 ? ` ${months}mo` : ''}`;

    // Return the date range and duration
    return `${dateRangeStr} | ${durationStr}`;
}

export { calculateDateRange };