import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Flame, Trophy, MapPin, Send, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import AchievementCard from './AchievementCard';
import useStore from '../../store/useStore';

import GlobalLoader from './../ui/GlobalLoader';

export default function FitnessFeed() {
  const { user, feed, fetchFeed } = useStore();
  const [loading, setLoading] = useState(feed.length === 0);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const initFetch = async () => {
      if (feed.length === 0) setLoading(true);
      await fetchFeed();
      setLoading(false);
    };
    initFetch();
  }, [fetchFeed]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/posts', { content: newPost });
      setNewPost('');
      fetchFeed();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchFeed(); // Silently update global state
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments`, { content: commentText });
      setCommentText('');
      fetchFeed(); // Silently update global state
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Post Form */}
      <form onSubmit={handleCreatePost} className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <input
            type="text"
            placeholder="Share your today's workout achievement..."
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-v2-soft-gray focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            type="submit" 
            disabled={submitting || !newPost.trim()}
            className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/95 flex items-center justify-center text-white transition-all disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Feed List */}
      {loading ? (
        <div className="py-8">
          <GlobalLoader text="Syncing Community..." />
        </div>
      ) : feed.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-white/5 bg-[#0F172A]/65">
          <Trophy className="w-12 h-12 text-v2-soft-gray mx-auto opacity-20 mb-4" />
          <h3 className="text-lg font-bold text-white">No Activity Yet</h3>
          <p className="text-v2-soft-gray text-xs mt-1">Be the first to publish a training story to the network!</p>
        </div>
      ) : (
        feed.map(post => (
          <div key={post.id} className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 hover:border-white/10 transition-colors flex flex-col gap-4">
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-bright border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                  {post.user.avatar ? (
                    <img src={post.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    post.user.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{post.user.name}</span>
                  <span className="text-[10px] text-v2-soft-gray font-medium uppercase tracking-wider">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs text-white/90 leading-relaxed">{post.content}</p>

            {post.image_url && (
              <div className="w-full rounded-xl overflow-hidden border border-white/5">
                <img src={post.image_url} alt="Post Attachment" className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Interactions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-6">
                <button onClick={() => handleToggleLike(post.id)} className="flex items-center gap-2 group">
                  <Heart className={`w-4 h-4 transition-colors ${post.liked_by_me ? 'text-[#EF4444] fill-[#EF4444]' : 'text-v2-soft-gray group-hover:text-[#EF4444]'}`} />
                  <span className={`text-[11px] font-bold ${post.liked_by_me ? 'text-white' : 'text-v2-soft-gray group-hover:text-white'}`}>
                    {post.likes_count}
                  </span>
                </button>
                <button 
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} 
                  className="flex items-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 text-v2-soft-gray group-hover:text-[#3B82F6] transition-colors" />
                  <span className="text-[11px] font-bold text-v2-soft-gray group-hover:text-white">
                    {post.comments_count}
                  </span>
                </button>
              </div>
              <button className="text-v2-soft-gray hover:text-white transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Comments Sub-Panel */}
            {activeCommentPostId === post.id && (
              <div className="flex flex-col gap-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                {/* List of comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2.5 items-start bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center text-white text-[10px] font-bold">
                          {c.user.avatar ? (
                            <img src={c.user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                          ) : (
                            c.user.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-bold text-white">{c.user.name}</span>
                            <span className="text-[8px] text-v2-soft-gray">
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-[11px] text-v2-soft-gray mt-1">{c.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment box */}
                <form onSubmit={e => handleAddComment(e, post.id)} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder-v2-soft-gray focus:outline-none focus:border-[#3B82F6]/50"
                  />
                  <button 
                    type="submit" 
                    disabled={!commentText.trim()}
                    className="px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[10px] font-bold disabled:opacity-40"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
