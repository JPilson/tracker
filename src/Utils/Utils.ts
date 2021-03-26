export default class Utils {

    static  generateUId(): string{
        const date = new Date()
        return `${date.getMilliseconds()}${date.getHours()}${date.getSeconds()}${date.getMonth()}${date.getTime()}`
    }
}

