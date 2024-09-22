// src/Chat.js
import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { TextField, Button, List, ListItem, ListItemText, Container, Box, Typography } from '@mui/material';
import { getToken, getUserProfile } from '../services/authService';

const Chat = () => {
    const [connection, setConnection] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(new Set<any>());

    const profile = getUserProfile();
    const username = profile?.email;
    const receiver = 'decipheringminds@gmail.com';

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl(`http://localhost:5228/chatHub?username=${username}`).withAutomaticReconnect()
            .build();

        connect.start()
            .then(() => {
                setConnection(connect);
                //return connect.invoke('GetMessages', username, receiver);
            })
            // .then(messages => {
            //     setMessages(messages);
            // })
            .catch(err => console.error('Connection failed: ', err));

        connect.on('ReceiveMessage', msg => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        connect.on('UpdateUserStatus', (user, isOnline) => {
            setOnlineUsers(prev => {
                const updated = new Set(prev);
                if (isOnline) {
                    updated.add(user);
                } else {
                    updated.delete(user);
                }
                return updated;
            });
        });

        return () => {
            connect.stop();
        };
    }, [username, receiver]);

    const sendMessage = async () => {
        if (connection && message) {
            await connection.invoke('SendMessage', username, receiver, message);
            setMessage('');
        }
    };

    return (
        <Container>
            <span>{ onlineUsers }</span>
            <Typography variant="h5">Chat with {receiver} {onlineUsers.has(receiver) ? '(Online)' : '(Offline)'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2 }}>
                <TextField
                    label="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                />
                <Button onClick={sendMessage} variant="contained" sx={{ marginTop: 1 }}>Send</Button>
            </Box>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {messages.map(msg => (
                    <ListItem key={msg.id}>
                        <ListItemText primary={`${msg.sender}: ${msg.content}`} secondary={new Date(msg.timestamp).toLocaleString()} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Chat;
