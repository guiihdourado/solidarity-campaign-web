/* eslint-disable @typescript-eslint/ban-types */
import {
  useForm as useReactHookForm,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FormState,
  Control,
  UseFormWatch,
  UseFormReset,
  UseFormResetField,
  UnpackNestedValue,
  DeepPartial
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

type UseFormResult<T> = {
  register: UseFormRegister<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  formState: FormState<T>;
  customRegister: Control<T, object>;
  watch: UseFormWatch<T>;
  resetForm: UseFormReset<T>;
  resetFieldForm: UseFormResetField<T>;
  setValue: UseFormSetValue<T>;
};

type OptionsUseForm<T> = {
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
};

const useForm = <T>(
  schema: Yup.ObjectSchema<any>,
  options?: OptionsUseForm<T>
): UseFormResult<T> => {
  const {
    register,
    handleSubmit,
    formState,
    control,
    watch,
    reset,
    resetField,
    setValue
  } = useReactHookForm<T>({
    resolver: yupResolver(schema),
    defaultValues: options?.defaultValues
  });

  return {
    register,
    handleSubmit,
    formState,
    customRegister: control,
    watch,
    setValue,
    resetForm: reset,
    resetFieldForm: resetField
  };
};

export { Yup };

export default useForm;
