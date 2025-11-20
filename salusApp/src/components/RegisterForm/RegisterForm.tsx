import { useState } from "react";
import type { FormData } from "../../interfaces/FormData";

import PersonalInformation from "../PersonalInformation/PersonalInformation";
import OccupationalIfomation from "../OccupationalIfonmation/OccupationalIfonmation";
import DemographicInformation from "../DemographicInformation/DemographicInformation";
import { useNavigate } from "react-router-dom";

import { RegisterAPI } from "../../services/salusApi";
import isError from "../../Utils/isError";
import type { RegisterPayload } from "../../interfaces/REgisterPayload";

const initialData: FormData = {
    name: '',
    email: '',
    password: '',
    occupation: '',
    expertise: '',
    crm: '',
    cpf: '',
    gender: '',
    phoneNumber: ''
};


export function RegisterForm() {
    const navigate = useNavigate();
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

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const payload: RegisterPayload = {
            personalData: {
                name: formData.name,
                cpf: formData.cpf,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                gender: formData.gender,
            },
            crm: formData.crm,
            occupation: formData.occupation,
            expertise: formData.expertise
        };
        
        try{
            const response = await RegisterAPI(payload);
             if(response.status === 201){
                   navigate('/')
             } else {
                alert("Cadastro efetuado, mas status inesperado.")
             }
        } catch(e: unknown) {
            const erroMessage = isError(e) ? e.message : "An unknown error corrured";
            console.error("Cadastro error: ", erroMessage);
        }
    }

    // const handleSubmit = () => {
    //     console.log("Dados finais a serem enviados:", formData);
    //     //api
    //     alert("Finalizado");
    //     navigate('/')
    // };

    const stepProps = { formData, updateFormData, nextStep, prevStep};

    let content;

    switch (currentStep) {
        case 1:
            content =  <PersonalInformation {...stepProps} />;
            break;
        case 2:
            content = <OccupationalIfomation {...stepProps} />;
            break;
        case 3:
            content = <DemographicInformation {...stepProps} handleSubmit={handleSubmit} />;
            break;
        default:
            content = <h2>Obrigado!!</h2>
    }

    return (
        <div>
            {content}
        </div>
    )
}