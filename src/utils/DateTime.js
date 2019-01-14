export default class DateTime {
    static toISOFormat(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    static isValidDate(dateString) {
        var epoch = Date.parse(dateString);

        if (isNaN(epoch) == false) {
            return true;
        }

        return false;
    }
}
