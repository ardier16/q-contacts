import { isBoolean } from 'lodash'
import isDate from 'lodash/isDate'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

import { isAddress } from './strings'

interface ValidationResult {
  isValid: boolean;
  message: string;
}
type ValidatorValue = string | number | boolean | Date | File | null;
type Validator<T extends ValidatorValue = ValidatorValue, U = unknown> = (val: T, form?: U) => ValidationResult;
type ValidatorFn<U, T extends ValidatorValue = ValidatorValue> = (val: U | ((form: unknown) => T)) => Validator<T>;

export const required: Validator = (val) => ({
  isValid: !isEmpty(val) || isNumber(val) || isDate(val) || isBoolean(val) || val instanceof File,
  message: 'This field is required'
})

export const requiredIf: ValidatorFn<(val: ValidatorValue, form: unknown) => boolean> = predicate => (val, form) => {
  return {
    isValid: !predicate(val, form) || required(val).isValid,
    message: 'This field is required'
  }
}

export const address: Validator<string> = val => ({
  isValid: !val || isAddress(val),
  message: 'Invalid address'
})

export const maxLength: ValidatorFn<string | number> = max => (val, form) => {
  return {
    isValid: String(val).length <= Number(getValidatorValue(max, form)),
    message: `Max length is ${max}`
  }
}

function getValidatorValue<T extends ValidatorValue> (raw: T | ((form: unknown) => T), form: unknown): T {
  return typeof raw === 'function' ? raw(form) : raw
}
