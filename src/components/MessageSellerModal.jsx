import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const MessageSellerModal = ({ open, onOpenChange, productName, sellerEmail }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const subject = `Interested in your "${productName}" listing`;

  const handleSubmit = () => {
    if (!message.trim()) {
      toast({ title: "Empty Message", description: "Please write a message to the seller.", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    // Simulate sending a message
    setTimeout(() => {
      console.log({
        to: sellerEmail,
        from: user.email,
        subject: subject,
        body: message,
      });
      toast({
        title: "Message Sent!",
        description: "Your message has been sent to the seller. (This is a simulation)",
      });
      setLoading(false);
      onOpenChange(false);
      setMessage('');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Contact Seller</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-white/80">Your Name</Label>
            <Input id="name" value={user.username} disabled className="glass-effect border-white/20 text-white/70" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white/80">Your Email</Label>
            <Input id="email" value={user.email} disabled className="glass-effect border-white/20 text-white/70" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject" className="text-white/80">Subject</Label>
            <Input id="subject" value={subject} disabled className="glass-effect border-white/20 text-white/70" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="text-white/80">Message</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Hi, I'm interested in this item..."
              className="glass-effect border-white/20 text-white" 
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading} className="floating-button text-black">
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSellerModal;