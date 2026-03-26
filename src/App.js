import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import datas from './data/datas.json'
import {Tache} from './component/Tache.js'
import {Folder} from './component/Folder.js'
import monAvatar from './Pictures/UserPic.jpg';
import iconeAdd from './Pictures/add.svg';

function App() {
  const [listeDossiers, setListeDossiers] = useState(datas.dossiers);
  
  const [show, setShow] = useState(false);
  const [nouveauDossier, setNouveauDossier] = useState({ title: '', description: '', color: '#8a2be2' });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const ajouterDossier = () => {
    if (nouveauDossier.title) {
      const dossierFinal = {
        ...nouveauDossier,
        id: Date.now(),
      };
      setListeDossiers([...listeDossiers, dossierFinal]);
      setNouveauDossier({ title: '', description: '', color: '#8a2be2' });
      handleClose();
    }
  };

  const supprimerDossier = (id) => {
    const nouvelleListe = listeDossiers.filter(d => d.id !== id);
    setListeDossiers(nouvelleListe);
  };

  const modifierDossier = (id) => {
    const nouveauNom = prompt("Entrez le nouveau nom du dossier :");
    if (nouveauNom) {
      const nouvelleListe = listeDossiers.map(d => 
        d.id === id ? { ...d, title: nouveauNom } : d
      );
      setListeDossiers(nouvelleListe);
    }
  };

const viewFolder = (f) => {
  const count = datas.relations.filter(rel => rel.dossier === f.id).length;
  return (
    <Folder 
      key={f.id} 
      id={f.id} 
      title={f.title} 
      taskCount={count} 
      color={f.color}
      onDelete={() => supprimerDossier(f.id)}
      onEdit={() => modifierDossier(f.id)}
    />
  );
}

  return (
    <div className="App">
      <header className="App-header">
        <div className='Dossier'>
          <div className='Utilisateur'>
            <img src={monAvatar} className="avatar" alt="avatar" />
            <p>Les projets commencent ici ! </p>
          </div>
          <div className='LesDossiers'>
            <div className="HeaderDossiers">
              <p className='TitreDossier'>Dossiers</p>
              <button className="btn-ajouter" onClick={handleShow}>
                <img src={iconeAdd} alt="Ajouter" className="add-icon" />
              </button>
            </div>
            {listeDossiers && listeDossiers.map(viewFolder)}
          </div>
        </div>
      </header>
      
      <main>
        <p>Taches</p>
        {datas.taches && datas.taches.map(t => <Tache key={t.id} title={t.title} />)}
      </main>

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
                onChange={(e) => setNouveauDossier({...nouveauDossier, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (optionnel)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                onChange={(e) => setNouveauDossier({...nouveauDossier, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Couleur</Form.Label>
              <Form.Select onChange={(e) => setNouveauDossier({...nouveauDossier, color: e.target.value})}>
                <option value="#8a2be2">Violet</option>
                <option value="#ffa500">Orange</option>
                <option value="#ffc0cb">Rose</option>
                <option value="#4cc9f0">Bleu ciel</option>
                <option value="#2ecc71">Vert</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
          <Button variant="primary" onClick={ajouterDossier} style={{backgroundColor: '#8a2be2', border: 'none'}}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;