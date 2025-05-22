import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState('');
  const [visitedDate, setVisitedDate] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(res => {
        const sorted = res.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      })
      .catch(() => console.error('Failed to load countries.'));
  }, []);

  const handleCountryChange = (e) => {
    const selected = countries.find(c => c.name.common === e.target.value);
    setCountry(selected?.name.common || '');
    setSelectedCountry(selected || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be under 5MB.");
      return;
    }

    setError('');
    setImage(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !country || !content) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('country', country);
    formData.append('content', content);
    formData.append('visited_date', visitedDate);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await axios.post('http://localhost:3000/blog', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(res.data.message);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a New Blog</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block mb-1 font-medium">Country</label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.cca3} value={c.name.common}>
                {c.name.common}
              </option>
            ))}
          </select>
        </div>

        {/* Country Info */}
        {selectedCountry && (
          <div className="bg-gray-50 p-4 border rounded text-sm">
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || 'N/A'}</p>
            <p><strong>Currency:</strong> {Object.values(selectedCountry.currencies || {})[0]?.name || 'N/A'}</p>
            <img src={selectedCountry.flags.svg} alt="flag" className="w-20 mt-2" />
          </div>
        )}

        {/* Visited Date */}
        <div>
          <label className="block mb-1 font-medium">Visited Date</label>
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium">Blog Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Write your experience..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="Preview"
              className="mt-2 w-full max-h-64 object-cover rounded border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Posting...' : 'Post Blog'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
