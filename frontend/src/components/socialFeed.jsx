import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Zap, Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Tooltip } from './ui/tooltip';
import { useAuthStore } from '@/store/authStore';

const SocialFeed = () => {
  const { posts, getPosts, user, addKudos, getKudos, removeKudos, getComments, comments, addComment } = useAuthStore();
  const [likedWorkouts, setLikedWorkouts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [commentVisibility, setCommentVisibility] = useState({});
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => {
    const fetchKudos = async () => {
      if (!posts.length || !user?.email) return;

      setIsLoading(true);
      const likedStatus = {};

      for (const post of posts) {
        try {
          if (post.kudosGivenBy && Array.isArray(post.kudosGivenBy) && post.kudosGivenBy.includes(user.email)) {
            likedStatus[post._id] = true;
            continue;
          }

          const response = await getKudos(post._id);

          if (Array.isArray(response) && response.includes(user.email)) {
            likedStatus[post._id] = true;
          } else if (response && typeof response === 'object' && Array.isArray(response.kudosGivenBy)) {
            if (response.kudosGivenBy.includes(user.email)) {
              likedStatus[post._id] = true;
            } else {
              likedStatus[post._id] = false;
            }
          } else {
            likedStatus[post._id] = false;
          }
        } catch (error) {
          likedStatus[post._id] = false;
        }
      }

      setLikedWorkouts(likedStatus);
      setIsLoading(false);
    };

    fetchKudos();
  }, [posts, user, getKudos]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleLike = async (id) => {
    if (likedWorkouts[id]) {
      try {
        await removeKudos(id, user.email);
        await getPosts();
        setLikedWorkouts((prev) => ({ ...prev, [id]: false }));
      } catch (error) { }
    } else {
      try {
        await addKudos(id, user.email);
        await getPosts();
        setLikedWorkouts((prev) => ({ ...prev, [id]: true }));
      } catch (error) { }
    }
  };

  const createComment = async (postId) => {
    if (!comment.trim()) return;

    try {
      await addComment(postId, user.name, comment);
      setComment("");
      await getPosts();

      // Refresh comments for this post
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchComments = async (postId) => {
    setLoadingComments(prev => ({ ...prev, [postId]: true }));

    try {
      const result = await getComments(postId);
      if (result && result.comments) {
        setPostComments(prev => ({ ...prev, [postId]: result.comments }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleCommentSection = async (postId) => {
    const newVisibility = !commentVisibility[postId];
    setCommentVisibility(prev => ({ ...prev, [postId]: newVisibility }));

    if (newVisibility && (!postComments[postId] || !postComments[postId].length)) {
      fetchComments(postId);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isPostLiked = (postId) => {
    return !!likedWorkouts[postId];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderCardContent = (workout) => {
    if (workout.postType === "cardio") {
      return (
        <div className="space-y-4">
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Distance:</span>
              <span>{workout.distance} km</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-semibold">Pace:</span>
              <span>{workout.pace} min/km</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-semibold">Duration:</span>
              <span>{workout.duration} minutes</span>
            </div>
          </div>
        </div>
      );
    } else if (workout.postType === "weights") {
      return (
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <div key={exercise._id} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{exercise.name}</span>
                <span className="text-gray-500">Sets: {exercise.sets.length}</span>
              </div>
              {exercise.sets.map((set, index) => (
                <div key={index} className="flex justify-between mt-1">
                  <span className="font-medium">Reps:</span>
                  <span>{set.reps}</span>
                  <span className="font-medium">Weight:</span>
                  <span>{set.weight} kg</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen relative">
      <div className="pt-2 pb-20">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.sort((a, b) => new Date(b.date) - new Date(a.date)).map(workout => {
            const isLiked = isPostLiked(workout._id);
            const showComments = commentVisibility[workout._id];
            const hasComments = postComments[workout._id] && postComments[workout._id].length > 0;
            const isLoadingComments = loadingComments[workout._id];

            return (
              <Card key={workout._id} className="mb-3 shadow-sm">
                <div className="p-3 flex items-center">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {getInitials(workout.name)}
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <span className="font-semibold text-gray-900">{workout.name}</span>
                    <div className="text-gray-500 text-xs">
                      {new Date(workout.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white shadow-sm rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    {workout.postType === 'cardio' ? (
                      <Zap className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Dumbbell className="h-5 w-5 text-purple-500" />
                    )}

                    <div className="flex-1">
                      <span className="font-medium text-gray-700 text-sm">{workout.activity}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="font-bold text-gray-900 text-sm truncate">{workout.title}</span>
                    </div>

                    <div className="text-sm text-gray-600 font-medium">
                      <span className="text-gray-900">{workout.duration} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="px-3 pb-3">
                  <p className="text-gray-800 text-sm">{workout.description}</p>
                  {renderCardContent(workout)}
                </div>
                <div className="px-3 py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Tooltip content={isLiked ? 'Unlike' : 'Like'}>
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent"
                          onClick={() => handleLike(workout._id)}
                          disabled={isLoading}
                        >
                          <Heart
                            className={`h-5 w-5 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                            fill={isLiked ? '#ef4444' : 'none'}
                            strokeWidth={1.5}
                          />
                          <span className={`text-xs ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                            {workout.kudos}
                          </span>
                        </Button>
                      </Tooltip>
                      <Button
                        variant="ghost"
                        className="hover:bg-transparent"
                        onClick={() => toggleCommentSection(workout._id)}
                      >
                        <MessageSquare className="h-5 w-4 text-gray-500" />
                        {workout.commentCount > 0 && (
                          <span className="text-xs text-gray-500">
                            {workout.commentCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {showComments && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    {/* Comment input */}
                    <div className="flex items-center mt-2 mb-3">
                      <Avatar className="h-6 w-6 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                        {getInitials(user?.name)}
                      </Avatar>
                      <input
                        type="text"
                        value={comment}
                        onChange={handleCommentChange}
                        className="ml-2 flex-1 border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
                        placeholder="Add a comment..."
                      />
                      <Button
                        variant="ghost"
                        className="ml-1 p-1 h-auto"
                        onClick={() => createComment(workout._id)}
                        disabled={!comment.trim()}
                      >
                        <ArrowRight className="h-4 w-4 text-cyan-400 hover:text-blue-400" />
                      </Button>
                    </div>

                    {/* Comments display */}
                    {isLoadingComments && (
                      <div className="flex justify-center py-2">
                        <div className="animate-spin h-4 w-4 border-2 border-cyan-400 rounded-full border-t-transparent"></div>
                      </div>
                    )}

                    {hasComments && !isLoadingComments && (
                      <div className="space-y-2">
                        {postComments[workout._id].map(comment => (
                          <div key={comment._id} className="flex items-start">
                            <Avatar className="h-6 w-6 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                              {getInitials(comment.name)}
                            </Avatar>
                            <div className="ml-2 flex-1">
                              <div className="bg-gray-100 rounded-lg p-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-xs">{comment.name}</span>
                                  <span className="text-gray-500 text-xs">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-xs mt-1">{comment.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
