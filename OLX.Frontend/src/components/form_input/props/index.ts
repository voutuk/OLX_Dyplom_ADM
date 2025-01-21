export interface FormInputProps {
    label: string,
    name: string,
    ruleType?: 'string' | 'email' | 'number' | 'date',
    typeMessage?: string, 
    requiredMessage?: string, 
    inputType?: string,
    placeholder: string
}