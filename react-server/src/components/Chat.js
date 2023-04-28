import {
    Button,
    ChatContainer,
    ConversationHeader,
    Message,
    MessageGroup,
    MessageInput,
    MessageList
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

export default function Chat(props) {

    const remoteSender1 = "Kai";
    const remoteSender2 = "Andy";
    const movieName = props.movieName;
    const localSender = props.yourName;
    const groupIdRef = useRef(0);
    const msgIdRef = useRef(props.data.length);
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [data, setData] = useState(props.data);
    const [groups, setGroups] = useState([]);

    /**
     * @param {String} message 
     * @param {String} sender 
     * @param {Boolean} notCancel by default pass true
     */

    const handleSend = (message, sender, timestamp, notCancel) => {
        if (groups.length > 0) {
            const lastGroup = groups[groups.length - 1];

            if (lastGroup.sender === sender) {
                // Add to group
                const newMessages = [...lastGroup.messages].concat({
                    _id: `m-${++msgIdRef.current}`,
                    message,
                    sender,
                });
                const newGroup = {
                    ...lastGroup,
                    messages: newMessages
                };
                const newGroups = groups.slice(0, -1).concat(newGroup);
                setGroups(newGroups);
            } else {
                // Sender different than last sender - create new group 
                const newGroup = {
                    _id: `g-${++groupIdRef.current}`,
                    direction: sender === localSender ? "outgoing" : "incoming",
                    messages: [{
                        _id: `m-${++msgIdRef.current}`,
                        message,
                        sender,
                    }],
                    sender: sender,
                    timestamp: timestamp
                };
                setGroups(groups.concat(newGroup));
            }
        } else {
            const newGroup = {
                _id: `g-${++groupIdRef.current}`,
                direction: sender === localSender ? "outgoing" : "incoming",
                messages: [{
                    _id: `m-${++msgIdRef.current}`,
                    message,
                    sender: sender
                }],
                sender: sender,
                timestamp: timestamp
            };
            setGroups([newGroup]);
        }

        if (!notCancel) {
            setMsgInputValue("");
            inputRef.current.focus();
        }
    };

    React.useMemo(() => {
        var tempGroups = [];
        var row;

        const handleBulkImport = (_id, message, sender, timestamp) => {
            console.log("Groups:");
            if (tempGroups.length > 0) {
                const lastGroup = tempGroups[tempGroups.length - 1];

                if (lastGroup.sender === sender) {
                    // Add to group
                    const newMessages = [...lastGroup.messages].concat({
                        _id: _id,
                        message,
                        sender,
                    });
                    const newGroup = {
                        ...lastGroup,
                        messages: newMessages,
                        timestamp: timestamp
                    };
                    tempGroups[tempGroups.length - 1] = newGroup;
                } else {
                    // Sender different than last sender - create new group 
                    const newGroup = {
                        _id: `g-${++groupIdRef.current}`,
                        direction: sender === localSender ? "outgoing" : "incoming",
                        messages: [{
                            _id: _id,
                            message,
                            sender,
                        }],
                        sender: sender,
                        timestamp: timestamp
                    };

                    tempGroups = [...tempGroups, newGroup];
                }
            } else {
                const newGroup = {
                    _id: `g-${++groupIdRef.current}`,
                    direction: sender === localSender ? "outgoing" : "incoming",
                    messages: [{
                        _id: _id,
                        message,
                        sender: sender
                    }],
                    sender: sender,
                    timestamp: timestamp
                };
                tempGroups = [...tempGroups, newGroup];
            }
        }
        console.log(tempGroups.length);

        for (var i = 0; i < data.length; i++) {
            row = data[i];
            handleBulkImport(row._id, row.message, row.sender, new Date(row.timestamp));
            setGroups(tempGroups);
        }
    }, []);

    return <div style={{
        height: "100vh"
    }}>
        <ChatContainer>
            <ConversationHeader>
                <ConversationHeader.Back />
                <ConversationHeader.Content userName={movieName} />
                <ConversationHeader.Actions>
                    <Button border={true} onClick={() => handleSend(`Hi, This is ${remoteSender1}`, remoteSender1, new Date(), true)} style={{
                        marginBottom: "1em"
                    }}>Add message from Sender 1</Button>
                    <Button border={true} onClick={() => handleSend(`Hi, This is ${remoteSender2}`, remoteSender2, new Date(), true)} style={{
                        marginBottom: "1em"
                    }}>Add message from Sender 2</Button>
                </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList>
                {groups.map(g => {
                    return <MessageGroup key={g._id} sender={g.sender} data-id={g._id} direction={g.direction}>
                        <MessageGroup.Header>
                            <Typography component={'subtitle2'}>
                                {g.sender}
                            </Typography>
                        </MessageGroup.Header>
                        <MessageGroup.Messages key={g._id}>
                            {g.messages.map(m => <Message key={m._id} data-id={m._id} model={m} />)}
                        </MessageGroup.Messages>
                        <MessageGroup.Footer>
                            <ReactTimeAgo date={g.timestamp} timeStyle={'round-minute'} />
                        </MessageGroup.Footer>
                    </MessageGroup>
                })}
            </MessageList>
            <MessageInput attachButton={false} placeholder="Type message here" onSend={m => handleSend(m, localSender, new Date())} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />
        </ChatContainer>
    </div >;
}