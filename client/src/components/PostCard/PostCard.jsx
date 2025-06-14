import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST_ROUTE } from '../../utils/path';
import { addPostToBookmarks, deletePostFromBookmarks } from '../../http/blogAPI';
import { Context } from '../../index';
import { useToast } from '../../context/ToastContext';
import './PostCard.css';

const PostCard = ({ post, bookmarksIds = [], onToggleBookmark }) => {
    const navigate = useNavigate();
    const { user } = useContext(Context);
    const [saved, setSaved] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        setSaved(bookmarksIds.includes(post.id));
    }, [post.id, bookmarksIds]);

    const toggleBookmark = async () => {
        try {
            if (!user.isAuth) {
                showToast('Увійдіть, щоб зберігати пости');
                return;
            }

            if (saved) {
                await deletePostFromBookmarks(post.id);
                onToggleBookmark?.(post.id);
                user.updateBookmarksCount();
            } else {
                await addPostToBookmarks(post.id);
                user.updateBookmarksCount();
            }
            setSaved(!saved);
        } catch (e) {
            console.error(e);
            showToast('Сталася помилка. Спробуйте пізніше.');
        }
    };

    return (
        <>
            <div className="post-card">
                <div className="post-card-img-wrapper" onClick={() => navigate(`${POST_ROUTE}/${post.id}`)}>
                    <img src={post.preview} alt={post.title} className="post-card-img" />
                </div>
                <div className="p-3 d-flex flex-column justify-content-between post-card-body">
                    <div className="post-card-title mb-0" onClick={() => navigate(`${POST_ROUTE}/${post.id}`)}>
                        {post.title}
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-end">
                            <small className="text-muted mt-0">{new Date(post.createdAt).toLocaleDateString()}</small>
                            <img
                                src={saved ? '/static/bookmark-icon-filled.svg' : '/static/bookmark-icon-empty.svg'}
                                alt="bookmark"
                                className="save-post-btn"
                                onClick={toggleBookmark}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;
