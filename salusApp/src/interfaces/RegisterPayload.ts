interface PersonalData {
    name: string;
    cpf: string;
    email: string;
 
    gender: string;
    phoneNumber: string;
    birthDate: string;
    password: string;
}

export interface RegisterPayload {
    personalData: PersonalData;
    crm: string;
    occupation: string;
    expertise: string;
}