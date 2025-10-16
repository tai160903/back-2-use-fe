import React, { useState, useEffect } from 'react';
import './MaterialModal.css';

const MaterialModal = ({ isOpen, onClose, material, onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    maximumReuse: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (material) {
      setFormData({
        materialName: material.materialName || '',
        maximumReuse: material.maximumReuse || '',
        description: material.description || ''
      });
    } else {
      setFormData({
        materialName: '',
        maximumReuse: '',
        description: ''
      });
    }
    setErrors({});
  }, [material, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    }

    if (!formData.maximumReuse) {
      newErrors.maximumReuse = 'Maximum reuse count is required';
    } else if (isNaN(formData.maximumReuse) || parseInt(formData.maximumReuse) <= 0) {
      newErrors.maximumReuse = 'Maximum reuse must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        materialName: formData.materialName.trim(),
        maximumReuse: parseInt(formData.maximumReuse),
        description: formData.description.trim()
      });
    }
  };

  const handleClose = () => {
    setFormData({
      materialName: '',
      maximumReuse: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="material-modal-overlay" onClick={handleClose}>
      <div className="material-modal" onClick={(e) => e.stopPropagation()}>
        <div className="material-modal-header">
          <h2 className="material-modal-title">
            {material ? 'Edit Material' : 'Add New Material'}
          </h2>
          <button className="material-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <form className="material-modal-form" onSubmit={handleSubmit}>
          <div className="material-form-group">
            <label htmlFor="materialName" className="material-form-label">
              Material Name *
            </label>
            <input
              type="text"
              id="materialName"
              name="materialName"
              value={formData.materialName}
              onChange={handleInputChange}
              className={`material-form-input ${errors.materialName ? 'error' : ''}`}
              placeholder="e.g., Plastic, Glass, Aluminum"
            />
            {errors.materialName && (
              <span className="material-form-error">{errors.materialName}</span>
            )}
          </div>

          <div className="material-form-group">
            <label htmlFor="maximumReuse" className="material-form-label">
              Maximum Reuse Count *
            </label>
            <input
              type="number"
              id="maximumReuse"
              name="maximumReuse"
              value={formData.maximumReuse}
              onChange={handleInputChange}
              className={`material-form-input ${errors.maximumReuse ? 'error' : ''}`}
              placeholder="e.g., 100"
              min="1"
            />
            {errors.maximumReuse && (
              <span className="material-form-error">{errors.maximumReuse}</span>
            )}
          </div>

          <div className="material-form-group">
            <label htmlFor="description" className="material-form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`material-form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the material properties and characteristics..."
              rows="4"
            />
            {errors.description && (
              <span className="material-form-error">{errors.description}</span>
            )}
          </div>

          <div className="material-modal-actions">
            <button 
              type="button" 
              className="material-modal-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="material-modal-submit"
            >
              {material ? 'Update Material' : 'Create Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
