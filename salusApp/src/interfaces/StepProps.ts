import type { FormData } from "./FormData";

export interface StepProps {
    formData: FormData;
    updateFormData: (fields: { [K in keyof FormData]?: FormData[K]}) => void;
    nextStep: () => void;
    prevStep: () => void;
}