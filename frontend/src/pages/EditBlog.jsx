import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [visitedDate, setVisitedDate] = useState('');
  const [error, setError] = useState('');

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const token = Cookies.get('token');

  useEffect(() => {
    // Fetch countries
    axios.get('https://restcountries.com/v3.1/all')
      .then(res => {
        const sorted = res.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      })
      .catch(() => console.error('Failed to fetch countries'));

    // Load blog data
    axios
      .get(`http://localhost:3000/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const blog = res.data.data;
        setTitle(blog.title);
        setCountry(blog.country);
        setContent(blog.content);
        setVisitedDate(blog.visited_date || '');
        setExistingImage(blog.image);

        const found = res.data.data.country;
        const countryData = res.data.data.country;
        const match = res.data.allCountries?.find(c => c.name.common === found);
        if (match) setSelectedCountry(match);
      })
      .catch((err) => {
        setError('Failed to load blog.');
        console.error(err);
      });
  }, [id, token]);

  const handleCountryChange = (e) => {
    const selected = countries.find(c => c.name.common === e.target.value);
    setCountry(selected?.name.common || '');
    setSelectedCountry(selected || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be under 5MB.');
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('country', country);
    formData.append('content', content);
    formData.append('visited_date', visitedDate);
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('imgPth', existingImage);
    }

    try {
      await axios.put(`http://localhost:3000/blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog updated successfully!');
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update blog.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Country</label>
          <select
            className="w-full p-2 border rounded"
            value={country}
            onChange={handleCountryChange}
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

        {selectedCountry && (
          <div className="bg-gray-50 p-4 rounded border text-sm">
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || 'N/A'}</p>
            <p><strong>Currency:</strong> {Object.values(selectedCountry.currencies || {})[0]?.name || 'N/A'}</p>
            <img src={selectedCountry.flags.svg} alt="flag" className="w-20 mt-2" />
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Visited Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            className="w-full p-2 border rounded h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload New Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />
          )}

          {!previewImage && existingImage && (
            <img src={`http://localhost:3000/${existingImage}`} alt="Existing" className="mt-2 w-full h-48 object-cover rounded" />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
