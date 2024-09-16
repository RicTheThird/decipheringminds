import axiosInstance from './axiosInstance';


export const postUserTest = async (data: any) => {
    const response = await axiosInstance.post('/usertests', data);
    return response.data;
};

export const getMyUserTest = async () => {
    const response = await axiosInstance.get('/usertests/my');
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

export const getActiveAppointment = async () => {
    const response = await axiosInstance.get('/appointments');
    return response.data;
};