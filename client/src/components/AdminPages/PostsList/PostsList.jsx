import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../../../http/blogAPI';
import { useNavigate } from 'react-router-dom';
import { EDIT_POST_ROUTE } from '../../../utils/path';
import './PostsList.css'

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12);
    const [totalPosts, setTotalPosts] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts(currentPage, postsPerPage);
                setPosts(data.posts || []);
                setTotalPosts(data.total || 0);
            } catch (error) {
                setError('Помилка при завантаженні постів');
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage, postsPerPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; // захист від виходу за межі
        setCurrentPage(page);
    };

    if (loading) {
        return <p>Завантаження...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return (
        <div className='mt-5'>
            {posts.length === 0 ? (
                <p>Статті не знайдені.</p>
            ) : (
                <div className="row">
                    {posts.map(post => (
                        <div key={post.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img
                                    src={post.preview}
                                    alt=""
                                    className="card-img-top"
                                />
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">{post.title}</h5>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
                                        <img
                                            src="/static/edit-icon.svg"
                                            className='post-edit-icon'
                                            alt="edit"
                                            onClick={() => navigate(`${EDIT_POST_ROUTE}/${post.id}`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пагінація */}
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

export default PostsList;
