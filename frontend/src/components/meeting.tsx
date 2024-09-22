import React, { useEffect } from 'react';
import { ZoomMtg } from "@zoom/meetingsdk";
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getMeetingSignature, getUserProfile } from '../services/authService';

const sdkKey = "MGJ749hdTHJqnAnzsyT4g";
const registrantToken = "";
const zakToken = "";
const leaveUrlPatient = "https://decipheringminds.com/dashboard/calendar";
const leaveUrlAdmin = "https://decipheringminds.com/dashboard/patient";

function startMeeting(signature: string, meetingNumber?: string, meetingPassword?: string,
     userName?: string, userEmail?: string, role?: string, userId?: string) {
    document.getElementById("zmmtg-root")!.style.display = "block";

    ZoomMtg.init({
        leaveUrl: role === '1' ? `${leaveUrlAdmin}?id=${userId}` : leaveUrlPatient,
        patchJsMedia: true,
        leaveOnPageUnload: true,
        success: (success: unknown) => {
            console.log(success);
            ZoomMtg.join({
                signature: signature,
                sdkKey: sdkKey,
                meetingNumber: meetingNumber || "0",
                passWord: meetingPassword,
                userName: userName || "User",
                userEmail: userEmail,
                tk: registrantToken,
                zak: zakToken,
                success: (success: unknown) => {
                    console.log(success);
                },
                error: (error: unknown) => {
                    console.log(error);
                },
            });
        },
        error: (error: unknown) => {
            console.log(error);
        },
    });
}

const Meeting: React.FC = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const meetingNumber = query.get('meetingNumber');
    const meetingPass = query.get('meetingPassword');
    const userId = query.get('userId');
    const email = query.get('email');
    const role = query.get('role');
    const name = query.get('name');

    useEffect(() => {
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        getSignature();
    }, []);

    const getSignature = () => {
        const sign = getMeetingSignature(meetingNumber, role, 3600);
        startMeeting(sign, meetingNumber || "0", meetingPass || "0", name || "No Name", email || "No email", role || '0', userId || '0');
    }
    return (
        <div>
        </div>
    );
};

export default Meeting;
