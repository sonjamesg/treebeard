
import React from 'react';
import Slider from "react-slick";
import { ArrowLeft, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const SlickArrow = ({ className, style, onClick, isLeft }) => (
  <div
    className={cn(
      className,
      'z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center',
      isLeft ? 'left-2' : 'right-2'
    )}
    style={{ ...style }}
    onClick={onClick}
  >
    {isLeft ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
  </div>
);

const CaptionStep = ({ user, caption, setCaption, mediaPreviews, mediaType, taggedUsers, loading, onBack, onSubmit, onTagUsers }) => {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: mediaPreviews.length > 1,
    prevArrow: <SlickArrow isLeft />,
    nextArrow: <SlickArrow />,
    dotsClass: "slick-dots slick-thumb",
  };

  return (
    <>
      <DialogHeader className="relative flex items-center justify-between flex-shrink-0 p-3 border-b border-white/10">
        <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-3 top-1/2 -translate-y-1/2"><ArrowLeft className="w-5 h-5" /></Button>
        <DialogTitle className="flex-1 font-semibold text-center text-white">Create New Post</DialogTitle>
        <Button onClick={onSubmit} disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 px-4 text-sm text-black floating-button">{loading ? 'Sharing...' : 'Share'}</Button>
      </DialogHeader>
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        <div className="relative w-full bg-black md:w-[60%] rounded-bl-lg">
          <div className="h-full w-full md:h-full md:w-full">
            {mediaPreviews.length > 0 && (
              <Slider {...sliderSettings} className="h-full w-full slick-container">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="h-full w-full">
                    <div className="flex items-center justify-center w-full h-full">
                      {mediaType === 'image' ? (
                        <img src={preview} alt={`Preview ${index + 1}`} className="object-contain w-full h-full max-h-[400px] md:max-h-full" />
                      ) : (
                        <video src={preview} controls className="object-contain w-full h-full max-h-[400px] md:max-h-full" />
                      )}
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:w-[40%]">
          <div className="flex items-center mb-4 space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-white">{user.username}</span>
          </div>
          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-grow text-white border-white/20 glass-effect placeholder:text-white/50"
            maxLength={2200}
          />
          <p className="mt-1 mb-4 text-sm text-right text-white/50">{caption.length}/2200</p>
          
          <Button variant="ghost" onClick={onTagUsers} className="justify-start w-full p-2 text-white/80 rounded-lg hover:bg-white/10">
            <UserPlus className="w-5 h-5 mr-2" />
            Tag people
          </Button>
          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {taggedUsers.map(u => (
                <div key={u.id} className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full bg-white/20">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={u.avatar} alt={u.username} />
                    <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {u.username}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CaptionStep;
