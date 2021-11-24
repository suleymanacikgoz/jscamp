import { users } from "../data/users.js"
import DataError from "../models/dataError.js"

export default class UserService {

    constructor(loggerService) {
        this.customers = []
        this.employees = []
        this.errors = []
        this.loggerService = loggerService
    }

    load() {
        for (const user of users) {

            switch (user.type) {
                case "customer":
                    if (!this.CheckCustomerValidityForErrors(user)) {
                        this.customers.push(user)
                    }
                    break;

                case "employee":
                    if (!this.CheckEmployeeValidityForErrors(user)) {
                        this.employees.push(user)
                    }
                    break;
                default:
                    this.errors.push(new DataError("wrong user type", user))
                    break;
            }

        }

    }

    CheckCustomerValidityForErrors(user) {
        let requiredFields = "id firstName lastName age City".split(" ")
        let hasErrors = false
        for (const field of requiredFields) {
            if (!user[field]) {
                hasErrors = true
                this.errors.push(new DataError(`Validation problem. ${field} is required`
                    , user))
            }
        }

        if (Number.isNaN(Number.parseInt(user.age))) {
            this.errors.push(new DataError(`Validation problem. ${user.age} is not a number`))
        }

        return hasErrors
    }

    CheckEmployeeValidityForErrors(user) {
        let requiredFields = "id firstName lastName age city salary".split(" ")
        let hasErrors = false
        for (const field of requiredFields) {
            if (!user[field]) {
                hasErrors = true
                this.errors.push(new DataError(`Validation problem. ${field} is required`
                    , user))
            }
        }
        if (Number.isNaN(Number.parseInt(user.age))) {
            this.errors.push(new DataError(`Validation problem. ${user.age} is not a number`))
        }

        return hasErrors
    }



    add(user) {
        switch (user.type) {
            case "customer":
                if (!this.CheckCustomerValidityForErrors(user)) {
                    this.customers.push(user)
                }
                break;
            case "employee":
                if (!this.CheckEmployeeValidityForErrors(user)) {
                    this.employees.push(user)
                }
                break;
            default:
                this.errors.push(new DataError("this user can not be added. Wrong user type", user))
                break;
        }
        this.loggerService.log(user)

    }

    list() {
        return this.customers
    }

    getById(id) {
        return this.customers.find(u => u.id === id)
    }

    getCustomersSorted() {
        return this.customers.sort((customer1, customer2) => {
            if (customer1.firstName < customer2.firstName) {
                return -1;
            } else if (customer1.firstName === customer2.firstName) {
                return 0;
            } else {
                return 1;
            }
        })
    }

}
