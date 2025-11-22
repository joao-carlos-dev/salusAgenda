import type { StepProps } from "./StepProps";
import type { FormData } from "./FormData";

export interface DemographicStepProps extends StepProps {
    handleSubmit: (data?: Partial<FormData>) => void | Promise<void>;
    disabled?: boolean;
    buttonText?: string;
}