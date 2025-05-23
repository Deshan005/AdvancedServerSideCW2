import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function FollowingFeed() {
  const [feedBlogs, setFeedBlogs] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [countryFilter, setCountryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [countries, setCountries] = useState([]);

  const token = Cookies.get('token');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      });
  }, []);

  useEffect(() => {
    if (!token) return;

    axios.get(`http://localhost:3000/blog/following-feed?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const newBlogs = res.data.blogs || [];
      setFeedBlogs((prev) => [...prev, ...newBlogs]);
      if (newBlogs.length < 6) setHasMore(false);
    })
    .catch((err) => {
      setError(err.response?.data?.message || 'Failed to load feed.');
    });
  }, [token, page]);

  const filteredBlogs = feedBlogs.filter(blog => {
    const matchCountry = countryFilter ? blog.country === countryFilter : true;
    const matchDate = dateFilter ? blog.visited_date?.startsWith(dateFilter) : true;
    return matchCountry && matchDate;
  });

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const getFlag = (name) => {
    const found = countries.find(c => c.name.common === name);
    return found?.flags?.svg || '';
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">📢 Following Feed</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Country</option>
          {countries.map((c) => (
            <option key={c.cca3} value={c.name.common}>
              {c.name.common}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
          placeholder="Filter by Date"
        />
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {filteredBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {blog.image && (
                  <img
                    src={`http://localhost:3000/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1 text-blue-700">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">By: {blog.author_email}</p>
                  {blog.visited_date && (
                    <p className="text-sm text-gray-500 mb-1">
                      Visited: {new Date(blog.visited_date).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Country: {blog.country}</span>
                    {getFlag(blog.country) && (
                      <img src={getFlag(blog.country)} alt="flag" className="w-5 h-4 object-cover" />
                    )}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-2">{blog.content}</p>

                  <div className="flex gap-4 text-sm mb-2">
                    <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full"> 👍 {blog.likes || 0}</span>
                    <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full"> 👎 {blog.dislikes || 0}</span>
                  </div>

                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center">No posts match the selected filters.</p>
      )}
    </div>
  );
}

export default FollowingFeed;
