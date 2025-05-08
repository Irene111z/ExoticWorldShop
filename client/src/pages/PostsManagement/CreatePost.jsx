import React, { useState, useEffect, useRef } from 'react';
import { fetchAuthors, createPost, createAuthor } from '../../http/blogAPI';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    preview: '',
    content: ''
  });

  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    lastname: '',
    occupation: '',
    workplace: '',
    sity: ''
  });
  const [isCreatingNewAuthor, setIsCreatingNewAuthor] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [embeddedImages, setEmbeddedImages] = useState([]); // { file, dataUrl }

  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    fetchAuthors().then(setAuthors).catch((error) => {
      console.error("Помилка при отриманні авторів:", error);
    });
  }, []);

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, preview: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedAuthorId(value);

    if (value === 'createNew') {
      setIsCreatingNewAuthor(true);
    } else {
      setIsCreatingNewAuthor(false);
    }
  };

  const handleAddSelectedAuthor = () => {
    if (!selectedAuthorId) return;

    const id = parseInt(selectedAuthorId);
    const alreadyAdded = selectedAuthors.some(a => a.id === id);
    if (!alreadyAdded) {
      const author = authors.find(a => a.id === id);
      if (author) {
        setSelectedAuthors(prev => [...prev, author]);
      }
    }
    setSelectedAuthorId('');
  };

  const handleRemoveAuthor = (id) => {
    setSelectedAuthors(prev => prev.filter(a => a.id !== id));
  };

  const handleNewAuthorChange = (e) => {
    setNewAuthor(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNewAuthor = async () => {
    if (newAuthor.name && newAuthor.lastname) {
      try {
        const response = await createAuthor(newAuthor);
        setAuthors(prev => [...prev, response]);
        setSelectedAuthors(prev => [...prev, response]);
        setIsCreatingNewAuthor(false);
        setSelectedAuthorId('');
        setNewAuthor({ name: '', lastname: '', occupation: '', workplace: '', sity: '' });
      } catch (error) {
        console.error("Помилка при створенні автора:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.preview || selectedAuthors.length === 0) {
      alert("Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('preview', formData.preview);
    selectedAuthors.forEach(author => formDataToSend.append('authorIds', author.id));

    try {
      await createPost(formDataToSend);
      alert('Пост успішно створено!');
      setFormData({ title: '', preview: '', content: '' });
      setSelectedAuthors([]);
      setPreviewUrl('');
    } catch (error) {
      console.error('Помилка при створенні посту:', error);
    }
  };

  return (
    <div className="container create-post-form">
      <p className='posts-title mt-3'>Створення статті</p>
      <form onSubmit={handleSubmit} className="">
        <div className="d-flex">
          <div className="d-flex flex-column me-3">
            <label htmlFor="preview">Обкладинка</label>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" style={{ width: '350px', height: 'auto', borderRadius: '10px' }} className='mb-2'/>
            )}
            <button type="button" className="btn-add-post-preview mb-2" onClick={handleClick}>
              Додати обкладинку
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handlePreviewChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <label className="mt-3">Автори статті</label>
            {selectedAuthors.length > 0 && (
              <div className="mt-0">
                {selectedAuthors.map(author => (
                  <div key={author.id} className='d-flex align-items-center mb-2'>
                    <img src="/static/delete-icon.svg" onClick={() => handleRemoveAuthor(author.id)} alt="" />
                    <p className='mb-0 ms-3'>{author.name} {author.lastname}, {author.occupation}, {author.workplace}, м. {author.sity}</p>
                  </div>
                ))}

              </div>
            )}
            <select value={selectedAuthorId} onChange={handleSelectChange} className="mb-2">
              <option value="" disabled hidden>Оберіть автора</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.lastname}, {author.workplace}
                </option>
              ))}
              <option value="createNew">Створити нового автора</option>
            </select>

            {!isCreatingNewAuthor && selectedAuthorId && selectedAuthorId !== 'createNew' && (
              <button type="button" onClick={handleAddSelectedAuthor} className='btn-add-author-to-post'>Зазначити як автора</button>
            )}

            {isCreatingNewAuthor && (
              <div className="d-flex flex-column mt-3 create-author-form">
                <h4>Новий автор</h4>
                <input name="name" className="mb-2" placeholder="Ім’я" value={newAuthor.name} onChange={handleNewAuthorChange} />
                <input name="lastname" className="mb-2" placeholder="Прізвище" value={newAuthor.lastname} onChange={handleNewAuthorChange} />
                <input name="occupation" className="mb-2" placeholder="Професія" value={newAuthor.occupation} onChange={handleNewAuthorChange} />
                <input name="workplace" className="mb-2" placeholder="Місце роботи" value={newAuthor.workplace} onChange={handleNewAuthorChange} />
                <input name="sity" className="mb-2" placeholder="Місто" value={newAuthor.sity} onChange={handleNewAuthorChange} />
                <button type="button" onClick={handleAddNewAuthor} className='btn-create-author'>Створити автора</button>
              </div>
            )}
          </div>
          <div className="d-flex flex-column w-100">
            <label htmlFor="title">Заголовок</label>
            <input name="title" className="mb-2" value={formData.title} onChange={handleFormChange} />

            <label htmlFor="content">Контент</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              className="mb-2"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </div>
        <button type="submit" className="mt-3 mb-5 btn-create-post">Опублікувати пост</button>
      </form>
    </div>
  );
};

export default CreatePost;
