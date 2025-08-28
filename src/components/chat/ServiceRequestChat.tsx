import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Paperclip,
  Download,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { format } from 'date-fns';
import { chatService } from '@/services/chatService';
import {
  ChatThread,
  ChatMessage,
  ChatParticipant,
  MessageType,
  ChatParticipantRole,
  MessageStatus,
  MessageAttachment
} from '@/types/chat';

interface ServiceRequestChatProps {
  serviceRequestId: string;
  bidId?: string;
  currentUserId: string;
  currentUserRole: ChatParticipantRole;
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ServiceRequestChat: React.FC<ServiceRequestChatProps> = ({
  serviceRequestId,
  bidId,
  currentUserId,
  currentUserRole,
  isOpen,
  onClose,
  initialMessage
}) => {
  const [chatThread, setChatThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load chat thread
  const loadChatThread = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getChatThreads(serviceRequestId);
      let thread = response.data.find(t => t.bidId === bidId || (!bidId && !t.bidId));
      
      if (!thread) {
        // Create new thread if none exists
        thread = await chatService.createChatThread(
          serviceRequestId,
          bidId,
          `Chat for Service Request ${serviceRequestId}`
        );
      }
      
      setChatThread(thread);
      setMessages(thread.messages);
      
      // Mark messages as read
      await chatService.markAsRead(thread.id, currentUserId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat thread",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [serviceRequestId, bidId, currentUserId, toast]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!chatThread) return;

    setIsSending(true);
    try {
      const message = await chatService.sendMessage(
        chatThread.id,
        currentUserId,
        newMessage.trim(),
        attachments.length > 0 ? MessageType.FILE : MessageType.TEXT,
        attachments,
        isPrivateMode,
        selectedRecipient
      );

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setAttachments([]);
      setIsPrivateMode(false);
      setSelectedRecipient('');
      
      toast({
        title: "Message sent",
        description: isPrivateMode ? "Private message sent successfully" : "Message sent successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !chatThread) return;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select files smaller than 10MB",
          variant: "destructive"
        });
        continue;
      }

      try {
        const attachment = await chatService.uploadAttachment(file, chatThread.id);
        setAttachments(prev => [...prev, attachment]);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
  };

  // Remove attachment
  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get participant initials
  const getParticipantInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get message status icon
  const getMessageStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENT:
        return <Clock className="h-3 w-3 text-gray-400" />;
      case MessageStatus.DELIVERED:
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case MessageStatus.READ:
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case MessageStatus.FAILED:
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: ChatParticipantRole) => {
    switch (role) {
      case ChatParticipantRole.SERVICE_SEEKER:
        return 'bg-blue-100 text-blue-800';
      case ChatParticipantRole.SERVICE_PROVIDER:
        return 'bg-green-100 text-green-800';
      case ChatParticipantRole.SYSTEM:
        return 'bg-gray-100 text-gray-800';
      case ChatParticipantRole.MODERATOR:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadChatThread();
      if (initialMessage) {
        setNewMessage(initialMessage);
      }
    }
  }, [isOpen, loadChatThread, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <div className="flex flex-col h-[70vh]">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    {chatThread?.title || 'Loading...'}
                  </DialogTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {chatThread?.status}
                    </Badge>
                    {chatThread?.isModerated && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Moderated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  {chatThread?.participants.length || 0}
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading messages...</div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.senderId === currentUserId
                            ? 'bg-blue-600 text-white'
                            : message.type === MessageType.SYSTEM
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg p-3 space-y-2`}
                      >
                        {/* Message Header */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{message.senderName}</span>
                            <Badge
                              className={`text-xs ${getRoleBadgeColor(message.senderRole)}`}
                            >
                              {message.senderRole.replace('_', ' ')}
                            </Badge>
                            {message.isPrivate && (
                              <Badge variant="outline" className="text-xs">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Private
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>{format(message.timestamp, 'HH:mm')}</span>
                            {message.senderId === currentUserId && getMessageStatusIcon(message.status)}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="text-sm">{message.message}</div>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between bg-white bg-opacity-20 rounded p-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <Paperclip className="h-4 w-4" />
                                  <span className="text-sm">{attachment.name}</span>
                                  <span className="text-xs opacity-75">
                                    ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                                  </span>
                                </div>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4 space-y-3">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between bg-gray-50 rounded p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAttachment(attachment.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Private Message Options */}
                {isPrivateMode && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EyeOff className="h-4 w-4" />
                    <span>Private message to:</span>
                    <select
                      value={selectedRecipient}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select recipient</option>
                      {chatThread?.participants
                        .filter(p => p.id !== currentUserId && p.role !== ChatParticipantRole.SYSTEM)
                        .map(participant => (
                          <option key={participant.id} value={participant.id}>
                            {participant.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Input Area */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSending}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPrivateMode(!isPrivateMode)}
                      className={isPrivateMode ? 'bg-yellow-50 border-yellow-300' : ''}
                    >
                      {isPrivateMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      onClick={sendMessage}
                      disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Compliance Notice */}
                <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-3 w-3 text-yellow-600 mt-0.5" />
                    <div>
                      <strong>Privacy Notice:</strong> All communications are monitored for quality and compliance. 
                      Contact information exchange is prohibited. Provider anonymity is maintained. All messages are monitored for compliance. Do not share personal contact information. Violations may result in chat restrictions.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants Sidebar */}
            {showParticipants && (
              <div className="w-64 border-l bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Participants</h3>
                <div className="space-y-3">
                  {chatThread?.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {getParticipantInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {participant.name}
                          {participant.isAnonymous && ' (Anonymous)'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getRoleBadgeColor(participant.role)}`}>
                            {participant.role.replace('_', ' ')}
                          </Badge>
                          <div className={`h-2 w-2 rounded-full ${
                            participant.isOnline ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestChat;
