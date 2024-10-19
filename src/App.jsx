import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, createPost, updatePost, deletePost } from './api';

function App() {
  const queryClient = useQueryClient();
  
  const { data: posts, isLoading, error } = useQuery(['posts'], fetchPosts);

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const updatePostMutation = useMutation(updatePost, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => queryClient.invalidateQueries('posts'),
  });

  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState(null);

  const handleCreatePost = (event) => {
    event.preventDefault();
    createPostMutation.mutate(newPost);
    setNewPost({ title: '', body: '' });
  };

  const handleUpdatePost = (event, post) => {
    event.preventDefault();
    updatePostMutation.mutate(post);
    setEditPost(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="App">
      <h1>Posts</h1>

      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Body"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          required
        />
        <button type="submit">Create Post</button>
      </form>

      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            {editPost?.id === post.id ? (
              <form onSubmit={(e) => handleUpdatePost(e, editPost)}>
                <input
                  type="text"
                  value={editPost.title}
                  onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                  required
                />
                <textarea
                  value={editPost.body}
                  onChange={(e) => setEditPost({ ...editPost, body: e.target.value })}
                  required
                />
                <button type="submit">Update</button>
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <button onClick={() => setEditPost(post)}>Edit</button>
                <button onClick={() => deletePostMutation.mutate(post.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;