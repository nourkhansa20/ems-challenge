/**
 * A utility function for validating input values .
 * It supports common validation rules like required fields, email, phone numbers, dates, numbers, and custom rules.
 * Each rule can be chained together, and the `validate` method returns the first error encountered or `undefined` if the value is valid.
 */

type ValidationRule = (value: any) => string | undefined;

export const validate = (value: any) => {
    const rules: ValidationRule[] = [];

    const validator = {
        required: (message: string = "This field is required") => {
            rules.push((val) => (val === undefined || val === null || val === "" ? message : undefined));
            return validator;
        },

        email: (message: string = "Invalid email address") => {
            rules.push((val) =>
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Email should be in form example@example.com' : undefined
            );
            return validator;
        },

        phone: (message: string = "Invalid phone number") => {
            rules.push((val) =>
                !/^\d{8,15}$/.test(val) ? 'Phone number have to be 8 number at least' : undefined
            );
            return validator;
        },

        min: (minValue: number, message: string = `Value must be at least ${minValue}`) => {
            rules.push((val) => (val < minValue ? message : undefined));
            return validator;
        },

        max: (maxValue: number, message: string = `Value must be at most ${maxValue}`) => {
            rules.push((val) => (val > maxValue ? message : undefined));
            return validator;
        },

        date: (message: string = "Invalid date") => {
            rules.push((val) => (isNaN(new Date(val).getTime()) ? message : undefined));
            return validator;
        },

        number: (message: string = "Value must be a number") => {
            rules.push((val) => (typeof val !== "number" || isNaN(val) ? message : undefined));
            return validator;
        },

        positive: (message: string = "Value must be a positive number") => {
            rules.push((val) => (typeof val !== "number" || val <= 0 ? message : undefined));
            return validator;
        },

        negative: (message: string = "Value must be a negative number") => {
            rules.push((val) => (typeof val !== "number" || val >= 0 ? message : undefined));
            return validator;
        },

        integer: (message: string = "Value must be an integer") => {
            rules.push((val) => (typeof val !== "number" || !Number.isInteger(val) ? message : undefined));
            return validator;
        },

        /**
         * Adds a custom validation rule.
         */
        custom: (rule: ValidationRule) => {
            rules.push(rule);
            return validator;
        },

        validate: () => {
            for (const rule of rules) {
                const error = rule(value);
                if (error) return error;
            }
            return undefined;
        },
    };

    return validator;
};