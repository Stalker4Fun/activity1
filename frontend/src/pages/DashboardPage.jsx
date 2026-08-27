import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername, clearAuth } from '../api/auth';
import {
  getServiceRequests,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest
} from '../api/requests';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const username = getUsername() || 'User';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getServiceRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401) {
        clearAuth();
        navigate('/login', { replace: true });
        return;
      }
      setErrorMessage(err.message || 'Failed to load service requests.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  function openCreateModal() {
    setEditingRequest(null);
    setIsModalOpen(true);
    setSuccessMessage('');
    setErrorMessage('');
  }

  function openEditModal(req) {
    setEditingRequest(req);
    setIsModalOpen(true);
    setSuccessMessage('');
    setErrorMessage('');
  }

  async function handleSaveRequest(formData) {
    try {
      if (editingRequest) {
        await updateServiceRequest(editingRequest.id, formData);
        setSuccessMessage(`Service request #${editingRequest.id} was updated successfully.`);
      } else {
        const created = await createServiceRequest(formData);
        setSuccessMessage(`Service request #${created.id} was created successfully.`);
      }
      await fetchRequests();
    } catch (err) {
      if (err.status === 401) {
        clearAuth();
        navigate('/login', { replace: true });
        return;
      }
      throw err;
    }
  }

  async function handleDelete(id) {
    setIsDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await deleteServiceRequest(id);
      setDeleteConfirmId(null);
      setSuccessMessage(`Service request #${id} was deleted successfully.`);
      await fetchRequests();
    } catch (err) {
      if (err.status === 401) {
        clearAuth();
        navigate('/login', { replace: true });
        return;
      }
      setErrorMessage(err.message || `Failed to delete request #${id}.`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="dashboard-container">
      <header className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="app-tag">ACTIVITY 1</span>
          <h2>Service Request Portal</h2>
        </div>
        <div className="navbar-user">
          <span className="user-greeting">
            Logged in as <strong>{username}</strong>
          </span>
          <button className="secondary-button logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="section-header">
          <div>
            <p className="eyebrow">MODULE</p>
            <h1 id="dashboard-title">My Service Requests</h1>
            <p className="subtitle">
              Manage and track your submitted service requests.
            </p>
          </div>
          <button className="primary-button create-btn" onClick={openCreateModal}>
            + Create Service Request
          </button>
        </div>

        {successMessage && (
          <div className="notice success alert-dismissible" role="status">
            <span>{successMessage}</span>
            <button className="notice-close" onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}

        {errorMessage && (
          <div className="notice error alert-dismissible" role="alert">
            <span>{errorMessage}</span>
            <button className="notice-close" onClick={() => setErrorMessage('')}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <p>Loading your service requests…</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Service Requests Found</h3>
            <p>You haven’t submitted any service requests yet.</p>
            <button className="primary-button" onClick={openCreateModal}>
              Create your first request
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="requests-table" aria-label="My Service Requests Table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '60px' }}>ID</th>
                  <th scope="col">Title</th>
                  <th scope="col" style={{ width: '130px' }}>Category</th>
                  <th scope="col">Description</th>
                  <th scope="col" style={{ width: '170px' }}>Date Created</th>
                  <th scope="col" style={{ width: '120px' }}>Created By</th>
                  <th scope="col" style={{ width: '160px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="id-cell">#{req.id}</td>
                    <td className="title-cell"><strong>{req.title}</strong></td>
                    <td>
                      <span className={`category-badge badge-${req.category?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {req.category}
                      </span>
                    </td>
                    <td className="desc-cell">{req.description}</td>
                    <td className="date-cell">{req.dateCreated}</td>
                    <td className="user-cell"><code>{req.createdBy}</code></td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(req)}
                          title="Edit Request"
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => setDeleteConfirmId(req.id)}
                          title="Delete Request"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)} role="dialog" aria-modal="true">
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="close-button" onClick={() => setDeleteConfirmId(null)}>×</button>
            </div>
            <p style={{ margin: '16px 0' }}>
              Are you sure you want to delete service request <strong>#{deleteConfirmId}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRequest}
        initialData={editingRequest}
      />
    </main>
  );
}
