import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'

type Validator<K extends string, V> = (val: V, values: Record<K, V>) => { isValid: boolean; message: string };

function useForm<K extends string, V> ({
  initialValues,
  validators,
  onChange = () => {},
  onSubmit = () => {}
}: {
  initialValues: Record<K, V>;
  validators: Record<K, Validator<K, V>[]>;
  onChange?: (_: Record<K, V>) => void;
  onSubmit?: (_: Record<K, V>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getDefaultErrors = useCallback(() => {
    return Object.keys(initialValues)
      .reduce((acc, key) => ({ ...acc, [key]: '' }), {} as Record<K, string>)
  }, [initialValues])

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState(getDefaultErrors())

  const validate = () => {
    return Object.entries(values)
      .map(([key, value]) => validateField(key as K, value as V))
      .every(val => val)
  }

  const validateField = (key: K, value: V) => {
    for (const validator of validators[key] || []) {
      const { isValid, message } = validator(value, values)
      if (!isValid) {
        setErrors((prev) => ({ ...prev, [key]: message }))
        return false
      }
    }

    setErrors((prev) => ({ ...prev, [key]: '' }))
    return true
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    await onSubmit(values)
    setIsSubmitting(false)
  }

  const reset = () => {
    setValues(initialValues)
    setErrors(getDefaultErrors())
  }

  useEffect(() => {
    onChange(values)
  }, [values])

  return {
    fields: useMemo(() => {
      return Object.keys(values)
        .reduce((acc, key) => ({
          ...acc,
          [key]: {
            value: values[key as K],
            error: errors[key as K],
            onChange: (value: V) => {
              setValues((prev) => ({ ...prev, [key]: value }))
              validateField(key as K, value)
            }
          }
        }), {} as Record<K, { value: V; error: string; onChange: (value?: V) => void }>)
    }, [values, errors, validators]),

    values,
    errors,

    isSubmitting,
    isValid: useMemo(() => {
      return Object.values(errors).every(val => val === '')
    }, [errors]),

    validate: useCallback(validate, [values, errors, validators]),
    setError (key: K, message: string) {
      setErrors((prev) => ({ ...prev, [key]: message }))
    },

    submit: useCallback(submit, [values]),
    reset: useCallback(reset, [values]),
  }
}

export default useForm
