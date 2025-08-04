import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageCircle, Send, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const Messages = () => {
  const { user } = useAuth();
  const { username: recipientUsername } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // This is a mock implementation using localStorage.
    // In a real app, this data would come from a backend.
    const allUsers = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const allMessages = JSON.parse(localStorage.getItem('socialvibe_messages') || '[]');

    const userConversations = allMessages.filter(m => m.from === user.id || m.to === user.id);
    const conversationPartners = [...new Set(userConversations.flatMap(m => [m.from, m.to]))]
      .filter(id => id !== user.id)
      .map(id => allUsers.find(u => u.id === id))
      .filter(Boolean);

    setConversations(conversationPartners);

    if (recipientUsername) {
      const foundRecipient = allUsers.find(u => u.username === recipientUsername);
      if (foundRecipient) {
        setRecipient(foundRecipient);
        const chatMessages = userConversations
          .filter(m => (m.from === user.id && m.to === foundRecipient.id) || (m.from === foundRecipient.id && m.to === user.id))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(chatMessages);
      }
    } else {
        setRecipient(null);
        setMessages([]);
    }
  }, [user.id, recipientUsername]);

  const handleSendMessage = (text, mediaUrl = null, mediaType = null) => {
    if ((!text || !text.trim()) && !mediaUrl) return;

    const allMessages = JSON.parse(localStorage.getItem('socialvibe_messages') || '[]');
    const message = {
      id: Date.now().toString(),
      from: user.id,
      to: recipient.id,
      text: text ? text.trim() : '',
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString()
    };
    allMessages.push(message);
    localStorage.setItem('socialvibe_messages', JSON.stringify(allMessages));
    setMessages([...messages, message]);
    setNewMessage('');
    if(!mediaUrl) toast({ title: "Message Sent!" });
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !recipient) return;
    
    const mediaType = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : (file.type.startsWith('audio/') ? 'audio' : null));
    if(!mediaType) {
        toast({title: "Unsupported File", description: "You can only share images, videos, or audio clips.", variant: "destructive"});
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        handleSendMessage(null, reader.result, mediaType);
        toast({title: "File sent!"});
    };
    reader.readAsDataURL(file);
  };
  
  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Helmet>
        <title>Messages - TreeBeard</title>
        <meta name="description" content="View your messages on TreeBeard." />
      </Helmet>
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] pt-4 flex">
        <div className={`w-full md:w-1/3 border-r border-white/10 p-4 ${recipientUsername ? 'hidden md:block' : 'block'}`}>
          <h1 className="text-2xl font-bold text-white mb-4">Conversations</h1>
          <div className="space-y-2">
            {conversations.map(convoUser => (
              <Link to={`/messages/${convoUser.username}`} key={convoUser.id} className="block">
                <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors ${recipient?.username === convoUser.username ? 'bg-white/10' : ''}`}>
                   <Avatar>
                      <AvatarImage src={convoUser.avatar} />
                      <AvatarFallback>{convoUser.username[0].toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <span className="text-white font-medium">{convoUser.username}</span>
                </div>
              </Link>
            ))}
             {conversations.length === 0 && <p className="text-white/60 text-center mt-8">No conversations yet.</p>}
          </div>
        </div>

        <div className={`w-full md:w-2/3 p-4 flex flex-col ${recipientUsername ? 'block' : 'hidden md:flex'}`}>
          {!recipient ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="m-auto text-center py-12">
              <div className="glass-effect rounded-2xl p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Your Messages</h1>
                <p className="text-white/70">Select a conversation to start chatting.</p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="border-b border-white/10 pb-4 mb-4">
                 <Link to={`/profile/${recipient.username}`} className="flex items-center space-x-3">
                   <Avatar>
                      <AvatarImage src={recipient.avatar} />
                      <AvatarFallback>{recipient.username[0].toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <h2 className="text-xl font-bold text-white">{recipient.username}</h2>
                 </Link>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.from === user.id ? 'bg-blue-600 text-white rounded-br-none' : 'glass-effect rounded-bl-none'}`}>
                      {msg.text && <p>{msg.text}</p>}
                      {msg.mediaUrl && (
                        <div className="mt-2">
                          {msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="Shared content" className="rounded-lg max-w-full" />}
                          {msg.mediaType === 'video' && <video src={msg.mediaUrl} controls className="rounded-lg max-w-full" />}
                          {msg.mediaType === 'audio' && <audio src={msg.mediaUrl} controls className="w-full" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePlusClick} className="text-white/70 hover:text-white hover:bg-white/10">
                    <PlusCircle className="w-5 h-5"/>
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*,audio/*" className="hidden" />
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 glass-effect border-white/20 text-white" 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)} />
                <Button onClick={() => handleSendMessage(newMessage)} className="floating-button text-black"><Send className="w-4 h-4" /></Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;