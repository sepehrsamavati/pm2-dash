import UIText from "../i18n/UIText";
import type { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

type CustomValidator = (value: unknown) => true | string;

/**
 * Generate 'react-hook-form' library validation config
 */
export default class FormValidationHelper<TForm extends FieldValues, TValue extends FieldPath<TForm>> {
    private validations: RegisterOptions<TForm, TValue> = {};

    private customValidators: CustomValidator[] = [];
    private _isOptional = false;
    private _isOptionalEnum = false;

    /**
     * Get created config object
     */
    resolve() {
        if (this.customValidators.length) {
            this.validations.validate = (value) => {
                // value may be optional (required is checked before here)
                if (value) {
                    for (const validator of this.customValidators) {
                        const validationResult = validator(value);
                        if (validationResult !== true)
                            return validationResult;
                    }
                }
                return true;
            };
        }

        this.validations.setValueAs = (value: unknown) => {
            if (this._isOptional && !value) return undefined;
            if (this._isOptionalEnum) {
                const asNum = parseInt(value as string);
                if (Number.isNaN(asNum))
                    return undefined;
                else
                    return asNum;
            }
            return value;
        };

        return this.validations;
    }

    /**
     * Remove field when falsy
     */
    isOptional(value = true) {
        this._isOptional = value;
        return this;
    }

    /**
     * Remove field when is -1 number (invalid enum value used as default value)
     */
    isOptionalEnum(value = true) {
        this._isOptionalEnum = value;
        delete this.validations.valueAsDate;
        delete this.validations.valueAsNumber;
        return this;
    }

    /**
     * Convert to number
     */
    isNumber(value = true) {
        this.validations.valueAsNumber = value;
        return this;
    }

    isRequired(value = true) {
        this.validations.required = {
            value,
            message: UIText.fieldIsRequired
        };
        return this;
    }

    min(min: number) {
        this.validations.min = {
            value: min,
            message: UIText.minValidValue.format(min)
        };
        return this;
    }

    max(max: number) {
        this.validations.max = {
            value: max,
            message: UIText.maxValidValue.format(max)
        };
        return this;
    }

    length(length: number) {
        this.customValidators.push(value => (value as string).length === length || UIText.validLength.format(length));
        return this;
    }

    minLength(length: number) {
        this.validations.minLength = {
            value: length,
            message: UIText.minValidLength.format(length)
        };
        return this;
    }

    maxLength(length: number) {
        this.validations.maxLength = {
            value: length,
            message: UIText.maxValidLength.format(length)
        };
        return this;
    }
}