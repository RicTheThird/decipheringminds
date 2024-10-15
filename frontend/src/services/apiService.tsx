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

export const getUnpublishUserTestScore = async () => {
    const response = await axiosInstance.get('/usertests/unpublish');
    return response.data;
};

export const getUserTestsAnalytics = async (previousDays: number) => {
    const response = await axiosInstance.get(`/usertests/analytics/days/${previousDays}`);
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


export const getAllUsers = async (role: string) => {
    const response = await axiosInstance.get(`/users/role/${role}`);
    return response.data;
}

export const updateUser = async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
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

export const postBlockOffTime = async (data: any) => {
    return await axiosInstance.post('/blockofftimes', data);
}

export const getBlockOffTime = async () => {
    const response = await axiosInstance.get('/blockofftimes');
    return response.data;
}

export const deleteSingleBlockOffTime = async (id: number) => {
    const response = await axiosInstance.delete(`/blockofftimes/${id}`);
    return response;
}

export const deleteRecurringBlockOffTime = async (id: number) => {
    const response = await axiosInstance.delete(`/blockofftimes/recurring/${id}`);
    return response;
}