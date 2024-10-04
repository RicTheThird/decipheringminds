import React, { useEffect, useRef, useState } from 'react';
import 'react-chat-elements/dist/main.css'
import { Grid, Typography } from '@mui/material';
import { Button, ChatList, Input, MessageList } from 'react-chat-elements';
import eventEmitter from '../services/eventEmitter';
import { getUserProfile } from '../services/authService';
import { getMyMessages, seenMessages, sendMessage } from '../services/apiService';

const ActiveChatKey = 'ActiveChatKey'
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key] as unknown as string; // Cast to string if needed
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
}

const ChatAdminView: React.FC = () => {

  const messageListReferance = useRef<any>(null)
  const [chatList, setChatList] = useState<any[]>([]);
  const [messagesRaw, setMessagesRaw] = useState<any[]>([]);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null)
  const [inputText, setInputText] = useState<string>('');

  const handleMessage = (data: any[]) => {
    //console.log(messagesRaw)
    // console.log('received')
    // console.log(data)
    const groupedUsers = groupBy(data, 'senderName');
    let chatList: any[] = []
    for (const key in groupedUsers) {
      const lastMessage = groupedUsers[key].find(g => g.senderName === key)
      console.log('lastMessage')
      console.log(lastMessage)
      const allmsg = groupedUsers[key];
      if (Number(localStorage.getItem('userId')) !== lastMessage.senderId) {
        const initial1 = key.split(' ')[0].toUpperCase()
        const initial2 = key.split(' ')[1].toUpperCase()
        chatList.push({
          avatar: `https://ui-avatars.com/api/?format=svg&rounded=true&name=${initial1}+${initial2}`,
          title: key, //sender name
          id: lastMessage.senderId,
          key: lastMessage.senderId,
          subtitle: lastMessage.message, //last message,
          date: new Date(lastMessage.createdAt),
          unread: allmsg.filter(m => !m.isSeen).length
        })
      }
    }
    setMessagesRaw(data)
    
    console.log('chatList')
    console.log(chatList)
    setChatList(chatList)
    const activeChat = localStorage.getItem(ActiveChatKey)
    if (activeChat) {
      setSelectedChat(JSON.parse(activeChat), null, null, data)
    }
  };

  const getInitialMessages = async () => {
    const response = await getMyMessages();
    if (response && response.length > 0) {
      handleMessage(response)
    }
  }

  useEffect(() => {
    getInitialMessages();
    eventEmitter.on<any[]>('messagePublished', handleMessage);
    // Clean up the subscription on unmount
    return () => {
      localStorage.removeItem('ActiveChatKey')
      eventEmitter.off<any[]>('messagePublished', handleMessage);
    };
  }, []);

  // Handle input change
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const sendText = async () => {
    const activeChat = localStorage.getItem(ActiveChatKey) ?? ""
    if (activeChat) {
      const recipientId = JSON.parse(activeChat)?.id
      const mList = messageList;
      mList.push(
        {
          id: '',
          focus: false,
          titleColor: 'black',
          forwarded: false,
          replyButton: false,
          status: 'received',
          removeButton: false,
          retracted: false,
          notch: false,
          date: new Date(),
          position: "right",
          type: "text",
          title: "You",
          text: inputText,
        }
      );
      setMessageList(mList)
      await sendMessage({ message: inputText, recipientId })
      setInputText('')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendText();
    }
  };

  const setSelectedChat = async (a, b, c, raw) => {
    const temp: any[] = []
    setActiveChat(a);
    console.log(a)
    await seenMessages({ senderId: a.id })
    a.unread = 0
    localStorage.removeItem(ActiveChatKey);
    localStorage.setItem(ActiveChatKey, JSON.stringify(a));
    const msgRaw = raw && raw.length > 0 ? raw : messagesRaw
    const activeChat = msgRaw
      .filter(m => m.senderId === a.id || m.recipientId === a.id)
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })

    const userId = Number(localStorage.getItem('userId'))
    activeChat.map(c => {
      temp.push(
        {
          id: '',
          focus: false,
          titleColor: 'black',
          forwarded: false,
          replyButton: false,
          status: 'received',
          removeButton: false,
          retracted: false,
          notch: false,
          date: new Date(c.createdAt),
          position: c.senderId === userId ? "right" : "left",
          type: "text",
          title: c.senderId === userId ? "You" : c.senderName,
          text: c.message,
        }
      )
    })
    setMessageList(temp)
    //console.log(activeChat)
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Typography variant="body1">
        <Grid container spacing={2} marginTop={2} marginBottom={3}>


          <Grid item xs={12} sm={4}>
            {
              !chatList || chatList.length === 0 && 
              <Typography variant="body1" sx={{ marginLeft: '20px', marginBottom: '20px' }}>Chat list is empty</Typography>
            }
            <ChatList
              className='chat-list'
              id='chat-list'
              lazyLoadingImage=''
              onClick={(a, b, c) => setSelectedChat(a, b, c, null)}
              dataSource={chatList} />
          </Grid>
          <Grid item xs={12} sm={8}>
            {messageList && messageList.length > 0 && <div>
              <Typography variant="h5" sx={{ marginLeft: '20px', marginBottom: '20px' }}>Chat with {activeChat.title}</Typography>
              <MessageList
                referance={messageListReferance}
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={messageList}
              />
              <Input
                inputStyle={{ border: '1px solid black', marginLeft: '20px' }}
                autoHeight={true}
                maxHeight={20}
                onKeyDown={handleKeyPress}
                value={inputText}
                onChange={handleChange}
                placeholder="Type here..."
                multiline={false}
                rightButtons={<Button color='white' backgroundColor='black' text='Send' onClick={() => sendText()} />}
              />
            </div>
            }
            {
              !messageList || messageList.length === 0 &&
              <Typography variant="body1" sx={{ marginLeft: '20px', marginBottom: '20px' }}>No selected chat</Typography>
            }
          </Grid>
        </Grid>

      </Typography>
    </div>
  );
};

export default ChatAdminView;
