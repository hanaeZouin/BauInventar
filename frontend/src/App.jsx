import { useEffect, useState } from 'react';
import './App.css';

const initialForm = {
  reference: '',
  name: '',
  category_id: '',
  quantity: 1,
  location: '',
  status: 'available',
  description: '',
};

function App() {
  const [stats, setStats] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState('dashboard');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
const [categoryForm, setCategoryForm] = useState({
  name: '',
  description: '',
});
const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setStats)
      .catch(() => setError('Impossible de charger les statistiques.'));
  }, [refresh]);

  useEffect(() => {
    if (page !== 'equipment' && page !== 'categories') return;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    fetch(`http://127.0.0.1:8000/api/equipment?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setEquipment(data.data))
      .catch(() => setError('Impossible de charger les équipements.'));

    fetch('http://127.0.0.1:8000/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setCategories)
      .catch(() => setError('Impossible de charger les catégories.'));
  }, [page, search, status, refresh]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleEdit = (item) => {
  setFormData({
    reference: item.reference,
    name: item.name,
    category_id: item.category_id || '',
    quantity: item.quantity,
    location: item.location || '',
    status: item.status,
    description: item.description || '',
  });

  setEditingId(item.id);
  setShowForm(true);
  setError('');
  setSuccess('');
};
const handleDelete = async (id) => {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer cet équipement ?'
  );

  if (!confirmed) return;

  setError('');
  setSuccess('');

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/equipment/${id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression.');
    }

    setSuccess('Équipement supprimé avec succès !');
    setRefresh((value) => value + 1);

  } catch (err) {
    setError(err.message);
  }
};


const handleCategoryChange = (e) => {
  setCategoryForm({
    ...categoryForm,
    [e.target.name]: e.target.value,
  });
};

const handleCategoryEdit = (category) => {
  setCategoryForm({
    name: category.name,
    description: category.description || '',
  });

  setEditingCategoryId(category.id);
  setShowCategoryForm(true);
  setError('');
  setSuccess('');
};

const handleCategorySubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const response = await fetch(
      editingCategoryId
        ? `http://127.0.0.1:8000/api/categories/${editingCategoryId}`
        : 'http://127.0.0.1:8000/api/categories',
      {
        method: editingCategoryId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(categoryForm),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        throw new Error(Object.values(data.errors).flat().join(' '));
      }
      throw new Error(data.message || 'Erreur lors de l’enregistrement.');
    }

    setCategoryForm({ name: '', description: '' });
    setEditingCategoryId(null);
    setShowCategoryForm(false);
    setSuccess(
      editingCategoryId
        ? 'Catégorie modifiée avec succès !'
        : 'Catégorie ajoutée avec succès !'
    );
    setRefresh((value) => value + 1);

  } catch (err) {
    setError(err.message);
  }
};

const handleCategoryDelete = async (id) => {
  if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
    return;
  }

  setError('');
  setSuccess('');

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/categories/${id}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression.');
    }

    setSuccess('Catégorie supprimée avec succès !');
    setRefresh((value) => value + 1);

  } catch (err) {
    setError(err.message);
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const response = await fetch(
      editingId
        ? `http://127.0.0.1:8000/api/equipment/${editingId}`
        : 'http://127.0.0.1:8000/api/equipment',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id || null,
          quantity: Number(formData.quantity),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        throw new Error(
          Object.values(data.errors).flat().join(' ')
        );
      }
      throw new Error(data.message || 'Une erreur est survenue.');
    }

    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);

    setSuccess(
      editingId
        ? 'Équipement modifié avec succès !'
        : 'Équipement ajouté avec succès !'
    );

    setRefresh((value) => value + 1);

  } catch (err) {
    setError(err.message);
  }
};

  const cards = stats
    ? [
        ['Total équipements', stats.total_equipment, '📦'],
        ['Catégories', stats.total_categories, '📁'],
        ['Quantité totale', stats.total_quantity, '🔢'],
        ['Disponibles', stats.available, '✅'],
        ['En utilisation', stats.in_use, '🏗️'],
        ['En maintenance', stats.maintenance, '🔧'],
      ]
    : [];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>BauInventar</h2>
        <p className="sidebar-subtitle">Gestion de chantier</p>

        <nav>
          <a
            href="#"
            className={page === 'dashboard' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setPage('dashboard');
              setError('');
              setSuccess('');
            }}
          >
            Dashboard
          </a>

          <a
            href="#"
            className={page === 'equipment' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setPage('equipment');
              setError('');
              setSuccess('');
            }}
          >
            Équipements
          </a>

                <a
        href="#"
        className={page === 'categories' ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          setPage('categories');
          setError('');
          setSuccess('');
        }}
      >
        Catégories
      </a>
        </nav>

        <div className="sidebar-footer">Inventory Management</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">GESTION D'INVENTAIRE</p>
            <h1>{page === 'dashboard' ? 'Dashboard' : 'Équipements'}</h1>
            <p className="subtitle">
              {page === 'dashboard'
                ? 'Vue générale de votre matériel de chantier'
                : 'Consultez et gérez votre matériel'}
            </p>
          </div>
          <div className="user-avatar">HZ</div>
        </header>
        

        {page === 'dashboard' && (
          <>
            <section className="welcome">
              <div>
                <p>Bienvenue sur BauInventar</p>
                <h2>Gérez votre matériel en toute simplicité.</h2>
              </div>
              <span>🏗️</span>
            </section>

            <section className="section">
              <h2>Vue d'ensemble</h2>
              {error && <p className="error">{error}</p>}
              {!stats && !error && <p>Chargement...</p>}

              <div className="stats-grid">
                {cards.map(([label, value, icon]) => (
                  <article className="stat-card" key={label}>
                    <div className="stat-icon">{icon}</div>
                    <p>{label}</p>
                    <h3>{value}</h3>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

{page === 'categories' && (
  <section className="section">
    <div className="equipment-header">
      <h2>Liste des catégories</h2>

      <button
        className="add-button"
        onClick={() => {
          setShowCategoryForm(!showCategoryForm);
          setCategoryForm({ name: '', description: '' });
          setEditingCategoryId(null);
          setError('');
          setSuccess('');
        }}
      >
        {showCategoryForm ? 'Fermer' : '+ Ajouter une catégorie'}
      </button>
    </div>

    {success && <p className="success">{success}</p>}
    {error && <p className="error">{error}</p>}

    {showCategoryForm && (
      <form className="equipment-form" onSubmit={handleCategorySubmit}>
        <h3>
          {editingCategoryId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h3>

        <div className="form-grid">
          <label>
            Nom *
            <input
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              placeholder="Ex: Engins"
              required
            />
          </label>

          <label className="full-width">
            Description
            <textarea
              name="description"
              value={categoryForm.description}
              onChange={handleCategoryChange}
              placeholder="Description de la catégorie..."
            />
          </label>
        </div>

        <button type="submit" className="add-button">
          {editingCategoryId ? 'Enregistrer les modifications' : 'Enregistrer'}
        </button>
      </form>
    )}

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description || '—'}</td>
              <td className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleCategoryEdit(category)}
                >
                  Modifier
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleCategoryDelete(category.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3">Aucune catégorie trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
)}

        {page === 'equipment' && (
          <section className="section">
            <div className="equipment-header">
              <h2>Liste des équipements</h2>
              <button
                className="add-button"
                onClick={() => {
                  setShowForm(!showForm);
                  setError('');
                  setSuccess('');
                }}
              >
                {showForm ? 'Fermer' : '+ Ajouter un équipement'}
              </button>
            </div>

            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}

            {showForm && (
              <form className="equipment-form" onSubmit={handleSubmit}>
                <h3>{editingId ? 'Modifier l’équipement' : 'Nouvel équipement'}</h3>

                <div className="form-grid">
                  <label>
                    Référence *
                    <input
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="Ex: ENG-002"
                      required
                    />
                  </label>

                  <label>
                    Nom *
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Camion de chantier"
                      required
                    />
                  </label>

                  <label>
                    Catégorie
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Sans catégorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Quantité *
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Emplacement
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Chantier B"
                    />
                  </label>

                  <label>
                    Statut *
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="available">Disponible</option>
                      <option value="in_use">En utilisation</option>
                      <option value="maintenance">En maintenance</option>
                    </select>
                  </label>

                  <label className="full-width">
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description de l'équipement..."
                    />
                  </label>
                </div>

                <button type="submit" className="add-button">
                  {editingId ? 'Enregistrer les modifications' : 'Enregistrer l’équipement'}
                </button>
              </form>
            )}

            <div className="equipment-toolbar">
              <input
                type="text"
                placeholder="Rechercher par nom ou référence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="in_use">En utilisation</option>
                <option value="maintenance">En maintenance</option>
              </select>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Équipement</th>
                    <th>Catégorie</th>
                    <th>Quantité</th>
                    <th>Emplacement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id}>
                      <td>{item.reference}</td>
                      <td>{item.name}</td>
                      <td>{item.category?.name || 'Non classé'}</td>
                      <td>{item.quantity}</td>
                      <td>{item.location || '—'}</td>
                      <td>
                        <span className={`status ${item.status}`}>
                          {item.status === 'available'
                            ? 'Disponible'
                            : item.status === 'in_use'
                              ? 'En utilisation'
                              : 'Maintenance'}
                        </span>
                      </td>
                      <td>
                          <td className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(item)}
                          >
                            Modifier
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(item.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                        </td>
                      </tr>
                  ))}

                  {equipment.length === 0 && (
                    <tr>
                      <td colSpan="7">Aucun équipement trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
