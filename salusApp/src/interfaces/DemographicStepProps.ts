import type { StepProps } from "./StepProps";

export interface DemographicStepProps extends StepProps {
    handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}