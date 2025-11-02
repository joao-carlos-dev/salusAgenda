import type { FormData } from "./FromData";

export interface StepProps {
    formData: FormData;
    updateFormData: (fields: Partial<FormData>) => void;
    nextStep: () => void;
    prevStep: () => void;
}