'use client';

import { useState } from 'react';

import CommentInput from './CommentInput';
import CommentList from './CommentList';

import { Comment } from '@/types';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <CommentList comments={comments} />
      <CommentInput postId={postId} onAddComment={handleAddComment} />
    </div>
  );
}
