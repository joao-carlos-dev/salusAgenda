import { useState } from "react";
import type { FormData } from "../../interfaces/FormData";

import PersonalInformation from "../PersonalInformation/PersonalInformation";
import ProfessionalIfomation from "../ProfessionalInformation/ProfessionalInformation";
import DemographicInformation from "../DemographicInformation/DemographicInformation";

const initialData: FormData = {
    username: '',
    email: '',
    password: '',
    profession: '',
    specialty: '',
    professionalDocument: '',
    cpf: '',
    genero: '',
};

export function RegisterForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialData);

    // att dados forms
    const updateFormData = (fields: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    //avançar proxima etapa
    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    }

    //para voltar
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    //chama a última etapa
    const handleSubmit = () => {
        console.log("Dados finais a serem enviados:", formData);
        //api
        alert("Finalizado");
    };

    const stepProps = { formData, updateFormData, nextStep, prevStep};

    let content;

    switch (currentStep) {
        case 1:
            content =  <PersonalInformation {...stepProps} />;
            break;
        case 2:
            content = <ProfessionalIfomation {...stepProps} />;
            break;
        case 3:
            content = <DemographicInformation {...stepProps} handleSubmit={handleSubmit} />;
            break;
        default:
            content = <h2>Obrigado!!</h2>
    }

    return (
        <div>
            <h3>Etapa {currentStep} de 3</h3>
            {content}
        </div>
    )
}