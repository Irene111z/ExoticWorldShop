import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../../http/blogAPI';
import { useNavigate } from 'react-router-dom';
import { POST_ROUTE } from '../../utils/path';
import './Posts.css'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
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
        <div>
            <p className='text-center blog-title my-4'>Блог</p>
            {posts.length === 0 ? (
                <p>Пости не знайдені.</p>
            ) : (
                <div className="row">
                    {posts.map(post => (
                        <div key={post.id} className="col-md-4 mb-4">
                            <div className="post-card" onClick={() => navigate(`${POST_ROUTE}/${post.id}`)}>
                                <div className="post-card-img-wrapper">
                                    <img
                                        src={post.preview}
                                        alt=""
                                        className="post-card-img"
                                    />
                                </div>
                                <div className="px-3 py-3">
                                    <span className="post-card-title">{post.title}</span>
                                    <div className="d-flex justify-content-between align-items-end mt-4">
                                        <button className='btn-view-post'>Переглянути</button>
                                        <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пагінація */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                    >
                        Попередня
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                    >
                        Наступна
                    </button>
                </div>
            )}
        </div>
    );
};

export default Posts;
