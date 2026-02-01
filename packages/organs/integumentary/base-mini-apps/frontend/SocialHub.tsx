import React, { useState } from 'react';

export function SocialHub() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([...posts, {
      id: Date.now(),
      content: newPost,
      author: 'You',
      timestamp: new Date(),
      likes: 0,
    }]);
    setNewPost('');
  };

  return (
    <div className="miniapp-social-hub">
      <div className="app-header">
        <h1>🌐 DreamNet Social Hub</h1>
        <p>Connect with other Dream State citizens and share dreams</p>
      </div>

      <div className="post-composer">
        <textarea
          placeholder="Share your dream..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      <div className="posts-feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <strong>{post.author}</strong>
              <span>{post.timestamp.toLocaleString()}</span>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <button>❤️ {post.likes}</button>
              <button>💬 Comment</button>
              <button>🔗 Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

