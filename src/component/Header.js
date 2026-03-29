import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import monAvatar from '../Pictures/UserPic.jpg';

export function Header({
  setListeDossiers,
  setListeTaches,
  setListeRelations,
  listeDossiers,
  listeTaches,
  listeRelations,
  datas,
  STORAGE_KEY,
  STORAGE_KEY_TACHES,
  STORAGE_KEY_RELATIONS,
}) {
  const [show, setShow]           = useState(false);
  const [showTache, setShowTache] = useState(false);

  const [nouveauDossier, setNouveauDossier] = useState({ title: '', description: '', color: '#75619d' });
  const [nouvelleTache,  setNouvelleTache]  = useState({ title: '', description: '', date_echeance: '', etat: 'Nouveau', dossierId: '' });

  const handleClose      = () => setShow(false);
  const handleShow       = () => setShow(true);
  const handleCloseTache = () => setShowTache(false);
  const handleShowTache  = () => setShowTache(true);

  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les données ? Toutes les modifications seront perdues.')) {
      setListeDossiers(datas.dossiers);
      setListeTaches(datas.taches);
      setListeRelations(datas.relations);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_TACHES);
      localStorage.removeItem(STORAGE_KEY_RELATIONS);
    }
  };

  const ajouterDossier = () => {
    if (nouveauDossier.title) {
      setListeDossiers([...listeDossiers, { ...nouveauDossier, id: Date.now() }]);
      setNouveauDossier({ title: '', description: '', color: '#75619d' });
      handleClose();
    }
  };

  const ajouterTache = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const echeance = nouvelleTache.date_echeance ? new Date(nouvelleTache.date_echeance) : null;
    if (echeance && echeance < today) {
      alert("La date d'échéance ne peut pas être dans le passé.");
      return;
    }
    if (nouvelleTache.title) {
      const newId = Date.now();
      const tacheFinal = {
        ...nouvelleTache,
        id: newId,
        date_creation: new Date().toISOString().split('T')[0],
        equipiers: [],
      };
      setListeTaches([...listeTaches, tacheFinal]);
      if (nouvelleTache.dossierId) {
        setListeRelations([...listeRelations, { tache: newId, dossier: parseInt(nouvelleTache.dossierId) }]);
      }
      setNouvelleTache({ title: '', description: '', date_echeance: '', etat: 'Nouveau', dossierId: '' });
      handleCloseTache();
    }
  };

  return (
    <>
      <div className="App-header">
        <div className="Utilisateur">
          <img src={monAvatar} className="avatar" alt="avatar" />
          <p className='TITRE'>Les projets commencent ici !</p>
          <div className="btn-header">
            <button className="btn-ajouter-tache" onClick={handleShowTache}>Ajouter un Tâche</button>
            <button className="btn-ajouter-dossier" onClick={handleShow}>Ajouter un Dossier</button>
            <button className="btn-reset" onClick={resetData}>Réinitialiser</button>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer un dossier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom du dossier</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom..."
                onChange={(e) => setNouveauDossier({ ...nouveauDossier, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                onChange={(e) => setNouveauDossier({ ...nouveauDossier, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Couleur</Form.Label>
              <Form.Select onChange={(e) => setNouveauDossier({ ...nouveauDossier, color: e.target.value })}>
                <option value="#75619d">Violet</option>
                <option value="#e87e47">Orange</option>
                <option value="#fb6f92">Rose</option>
                <option value="#8fb6d8">Bleu ciel</option>
                <option value="#6ea89e">Vert</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
          <Button variant="primary" onClick={ajouterDossier} style={{ backgroundColor: '#75619d', border: 'none' }}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTache} onHide={handleCloseTache} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer une tâche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom de la tâche</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom..."
                value={nouvelleTache.title}
                onChange={(e) => setNouvelleTache({ ...nouvelleTache, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={nouvelleTache.description}
                onChange={(e) => setNouvelleTache({ ...nouvelleTache, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date échéance</Form.Label>
              <Form.Control
                type="date"
                value={nouvelleTache.date_echeance}
                onChange={(e) => setNouvelleTache({ ...nouvelleTache, date_echeance: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>État</Form.Label>
              <Form.Select
                value={nouvelleTache.etat}
                onChange={(e) => setNouvelleTache({ ...nouvelleTache, etat: e.target.value })}
              >
                <option value="Nouveau">Nouveau</option>
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dossier (optionnel)</Form.Label>
              <Form.Select
                value={nouvelleTache.dossierId}
                onChange={(e) => setNouvelleTache({ ...nouvelleTache, dossierId: e.target.value })}
              >
                <option value="">— Aucun —</option>
                {listeDossiers.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTache}>Fermer</Button>
          <Button variant="primary" onClick={ajouterTache} style={{ backgroundColor: '#75619d', border: 'none' }}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}