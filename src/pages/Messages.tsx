import { useState, useEffect, useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserConversations, getConversationMessages, sendMessage, getUserById, markMessagesAsRead } from '@/lib/storage';
import { Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Messages = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ReturnType<typeof getConversationMessages>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = user ? getUserConversations(user.id) : [];
  const activeConversation = conversations.find(c => c.id === conversationId);

  useEffect(() => {
    if (conversationId && user) {
      setMessages(getConversationMessages(conversationId));
      markMessagesAsRead(conversationId, user.id);
    }
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      setMessages(getConversationMessages(conversationId));
    }, 1000);
    return () => clearInterval(interval);
  }, [conversationId]);

  if (!user) return <Navigate to="/auth" />;

  const getOtherUser = (conv: typeof conversations[0]) => {
    const otherId = conv.participantIds.find(id => id !== user.id);
    return otherId ? getUserById(otherId) : null;
  };

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;
    sendMessage(conversationId, user.id, message.trim());
    setMessage('');
    setMessages(getConversationMessages(conversationId));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className={cn("md:col-span-1 p-0 overflow-hidden", conversationId && "hidden md:block")}>
            <div className="p-4 border-b">
              <h2 className="font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100%-60px)]">
              {conversations.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">No conversations yet</p>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherUser(conv);
                  if (!otherUser) return null;
                  return (
                    <Link
                      key={conv.id}
                      to={`/messages/${conv.id}`}
                      className={cn(
                        "flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b",
                        conv.id === conversationId && "bg-muted"
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{otherUser.name}</p>
                        {conv.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className={cn("md:col-span-2 flex flex-col", !conversationId && "hidden md:flex")}>
            {activeConversation ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <Link to="/messages" className="md:hidden">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  {(() => {
                    const otherUser = getOtherUser(activeConversation);
                    return otherUser ? (
                      <>
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{otherUser.name}</span>
                      </>
                    ) : null;
                  })()}
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={cn("flex", msg.senderId === user.id ? "justify-end" : "justify-start")}
                      >
                        <div className={cn(
                          "max-w-[70%] px-4 py-2 rounded-2xl",
                          msg.senderId === user.id 
                            ? "gradient-primary text-white rounded-br-md" 
                            : "bg-muted rounded-bl-md"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <Button onClick={handleSend} className="gradient-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
