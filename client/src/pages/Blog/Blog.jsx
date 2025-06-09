import React, { useState, useEffect, useContext } from 'react';
import { fetchPosts, fetchBookmarks } from '../../http/blogAPI';
import PostCard from '../../components/PostCard/PostCard';
import './Blog.css';
import { Context } from '../..';

const Blog = () => {
  const { user } = useContext(Context)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const [bookmarksIds, setBookmarksIds] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts(currentPage, postsPerPage);
        setPosts(postsData.posts || []);
        setTotalPosts(postsData.total || 0);

        // Запит на закладки тільки якщо користувач авторизований
        if (user.isAuth) {
          const bookmarks = await fetchBookmarks();
          setBookmarksIds(bookmarks.rows.map(b => b.postId));
        } else {
          setBookmarksIds([]);
        }
      } catch (error) {
        setError('Помилка при завантаженні постів');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, postsPerPage, user.isAuth]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className='container-xxl container-fluid'>
      <p className='text-center blog-title my-4'>Блог</p>
      {posts.length === 0 ? (
        <p>Пости не знайдені.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-md-4 mb-4">
              <PostCard post={post} bookmarksIds={bookmarksIds} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                &laquo;
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Blog;
