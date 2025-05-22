import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function BlogDetails() {
  const { id } = useParams();
  const token = Cookies.get('token');

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [countryFlag, setCountryFlag] = useState(null);

  // Fetch blog + country flag
  useEffect(() => {
    axios.get(`http://localhost:3000/blog/${id}`)
      .then(res => {
        const blogData = res.data.data;
        setBlog(blogData);

        // Fetch country flag
        return axios.get(`https://restcountries.com/v3.1/name/${blogData.country}?fullText=true`);
      })
      .then(res => {
        setCountryFlag(res.data[0]?.flags?.svg || null);
      })
      .catch(() => setCountryFlag(null));
  }, [id]);

  // Fetch likes/dislikes and comments
  useEffect(() => {
    axios.get(`http://localhost:3000/blog/${id}/likes`)
      .then(res => {
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
      });

    axios.get(`http://localhost:3000/blog/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Comments error", err));

    axios.get(`http://localhost:3000/blog/${id}/reaction`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserReaction(res.data.reaction))
    .catch(() => setUserReaction(null));
  }, [id]);

  const handleLike = () => {
    axios.post(`http://localhost:3000/blog/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setLikes(prev => prev + 1);
      setUserReaction('like');
    });
  };

  const handleDislike = () => {
    axios.post(`http://localhost:3000/blog/${id}/dislike`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setDislikes(prev => prev + 1);
      setUserReaction('dislike');
    });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    axios.post(`http://localhost:3000/blog/${id}/comment`, { text: comment }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setComments(prev => [...prev, { comment_text: comment }]);
      setComment('');
    });
  };

  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
  if (!blog) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      {/* Blog Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-sm text-gray-600">By: {blog.author_email}</p>
        {blog.visited_date && (
          <p className="text-sm text-gray-500">Visited on: {new Date(blog.visited_date).toLocaleDateString()}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <p className="text-gray-500">Country: {blog.country}</p>
          {countryFlag && <img src={countryFlag} alt="flag" className="w-6 h-4 object-cover rounded-sm" />}
        </div>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={`http://localhost:3000/${blog.image}`}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}

      {/* Blog Content */}
      <p className="text-gray-800 text-lg whitespace-pre-wrap mb-8">{blog.content}</p>

      {/* Reactions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleLike}
          disabled={userReaction === 'like'}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            userReaction === 'like'
              ? 'bg-gray-200 text-gray-500'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          👍 Like ({likes})
        </button>
        <button
          onClick={handleDislike}
          disabled={userReaction === 'dislike'}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            userReaction === 'dislike'
              ? 'bg-gray-200 text-gray-500'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          👎 Dislike ({dislikes})
        </button>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleComment} className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Comment
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Comments:</h4>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="p-3 border rounded bg-gray-50 text-sm">
              {c.comment_text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
