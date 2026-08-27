import { useState, useEffect } from 'react';

const CATEGORIES = [
  'IT Support',
  'Hardware',
  'Software',
  'Network',
  'Maintenance',
  'General Inquiry'
];

export default function ServiceRequestModal({ isOpen, onClose, onSave, initialData = null }) {
  const isEditing = Boolean(initialData && initialData.id);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'IT Support'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'IT Support'
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: 'IT Support'
      });
    }
    setErrors({});
    setModalError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setModalError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!form.category.trim()) nextErrors.category = 'Category is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setModalError('');
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim()
      });
      onClose();
    } catch (err) {
      setModalError(err.message || 'Failed to save request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Service Request' : 'Create New Service Request'}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        {modalError && <p className="notice error" role="alert">{modalError}</p>}

        <form noValidate onSubmit={handleSubmit}>
          <label htmlFor="req-title">Title</label>
          <input
            id="req-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Laptop display flickering"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}

          <label htmlFor="req-category">Category</label>
          <select
            id="req-category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category}</p>}

          <label htmlFor="req-description">Description</label>
          <textarea
            id="req-description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Provide details about your service request..."
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <p className="field-error">{errors.description}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : (isEditing ? 'Update Request' : 'Create Request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

