function dateToStr(date) {
    /**
     * @param {Date} date
     * @returns {string}
     * @description
     * Converts a date object to a string in the format "Month (truncated) Year".
     * Example: 01/01/2021 -> "Jan '21"
     */
    const options = { month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * @param {Date} start
 * @param {Date} end
 * @returns {string}
 * @description
 * Calculates the duration between two dates and returns a string in the format "Month (truncated) Year - Month (truncated) Year".
 * Example: 01/01/2021 - 01/01/2022 -> "Jan '21 - Feb '22 | 1yr 1mo"
 */
function calculateDateRange(start, end) {
    
    // Edge case: if the end date is not provided, end date is 'Present' (current date)
    start = new Date(start);
    let isPresent = false;
    if (!end) {
        end = new Date();
        isPresent = true;
    } else {
        end = new Date(end);
    }

    // Calculate the duration between two dates
    const duration = end - start;
    const durationInMonths = duration / (1000 * 60 * 60 * 24 * 30.44); // 30.44 days in a month (average)
    const years = Math.floor(durationInMonths / 12);
    const months = Math.floor(durationInMonths % 12);

    // Convert the dates to strings
    const startDate = dateToStr(start);
    const endDate = dateToStr(end);

    const dateRangeStr = `${startDate} - ${isPresent ? 'Present' : endDate}`;
    const durationStr = `${years}yr ${months === 0 ? '' : months + 'mo'}`;

    // Return the date range and duration
    return `${dateRangeStr} | ${durationStr}`;
}

export { calculateDateRange };