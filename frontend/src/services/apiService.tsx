import axiosInstance from './axiosInstance';


export const postUserTest = async (data: any) => {
    const response = await axiosInstance.post('/usertests', data);
    return response.data;
};

export const postUserScores = async (testId: number, data: any) => {
    const response = await axiosInstance.put(`/usertests/score/${testId}`, data);
    return response.data;
};


export const getMyUserTest = async () => {
    const response = await axiosInstance.get('/usertests/my');
    return response.data;
};

export const getUserTest = async (id: number) => {
    const response = await axiosInstance.get(`/usertests/user/${id}`);
    return response.data;
};
export const postUserAppointment = async (data: any) => {
    const response = await axiosInstance.post('/appointments', data);
    return response.data;
};

export const updateUserAppointmentStatus = async (status: string, id: number) => {
    const response = await axiosInstance.put(`/appointments/status/${status}/${id}`);
    return response.data;
};

export const getMyAppointment = async () => {
    const response = await axiosInstance.get('/appointments/my');
    return response.data;
};

export const getUserAppointment = async (userId: number) => {
    const response = await axiosInstance.get(`/appointments/user/${userId}`);
    return response.data;
};

export const getActiveAppointment = async () => {
    const response = await axiosInstance.get('/appointments');
    return response.data;
};

export const getActiveAppointmentByDate = async (data: any) => {
    const response = await axiosInstance.post('/appointments/unavailable-time', {appointmentDate : data});
    return response.data;
};


export const getAllPatients = async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
}

export const getUserById = async (userId: number) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
}

export const getMyMessages = async () => {
    const response = await axiosInstance.get(`/messages/my`);
    return response.data;
}

export const sendMessage = async (msg: any) => {
    const response = await axiosInstance.post(`/messages`, msg);
    return response.data;
}

export const seenMessages = async (data: any) => {
    const response = await axiosInstance.post(`/messages/seen`, data);
    return response.data;
}

export const postPsychReport = async (data: any) => {
    const response = await axiosInstance.post(`/psychreports`, data);
    return response.data;
}