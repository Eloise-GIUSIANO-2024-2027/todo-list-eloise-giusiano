import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import datas from './data/datas.json'
import { Tache } from './component/Tache.js'
import { Folder } from './component/Folder.js'
import { Header } from './component/Header.js'
import { Footer } from './component/Footer.js'
import { ETATS, ETAT_TERMINE } from './component/Etats.js'

const STORAGE_KEY           = 'taskmanager_dossiers';
const STORAGE_KEY_TACHES    = 'taskmanager_taches';
const STORAGE_KEY_RELATIONS = 'taskmanager_relations';

const TRIS = {
  DATE_CREATION: 'Date création',
  DATE_ECHEANCE: 'Date échéance',
  NOM:           'Nom',
};

const hasSavedData = () =>
  localStorage.getItem(STORAGE_KEY) ||
  localStorage.getItem(STORAGE_KEY_TACHES) ||
  localStorage.getItem(STORAGE_KEY_RELATIONS);

const loadFromStorage = () => ({
  dossiers:  JSON.parse(localStorage.getItem(STORAGE_KEY))           ?? datas.dossiers,
  taches:    JSON.parse(localStorage.getItem(STORAGE_KEY_TACHES))    ?? datas.taches,
  relations: JSON.parse(localStorage.getItem(STORAGE_KEY_RELATIONS)) ?? datas.relations,
});

const resetStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY_TACHES);
  localStorage.removeItem(STORAGE_KEY_RELATIONS);
};

function App() {
  const [ready, setReady]         = useState(!hasSavedData());
  const [showModal, setShowModal] = useState(!!hasSavedData());

  const [listeDossiers, setListeDossiers]   = useState(datas.dossiers);
  const [listeTaches, setListeTaches]       = useState(datas.taches);
  const [listeRelations, setListeRelations] = useState(datas.relations);

  const handleRestore = () => {
    const saved = loadFromStorage();
    setListeDossiers(saved.dossiers);
    setListeTaches(saved.taches);
    setListeRelations(saved.relations);
    setShowModal(false);
    setReady(true);
  };

  const handleReset = () => {
    resetStorage();
    setListeDossiers(datas.dossiers);
    setListeTaches(datas.taches);
    setListeRelations(datas.relations);
    setShowModal(false);
    setReady(true);
  };

  const [triActif, setTriActif] = useState(TRIS.DATE_ECHEANCE);
  const [showTri, setShowTri]   = useState(false);
  const triRef = useRef(null);

  const [filtresDossiers,  setFiltresDossiers]  = useState(new Set());
  const [filtresEtats,     setFiltresEtats]     = useState(new Set());
  const [filtreEnCours,    setFiltreEnCours]    = useState(true);
  const [filtreExpirees,   setFiltreExpirees]   = useState(false);
  const [showFiltre, setShowFiltre]             = useState(false);
  const filtreRef = useRef(null);

  const [ongletActif, setOngletActif] = useState('taches');

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(listeDossiers));
  }, [listeDossiers, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY_TACHES, JSON.stringify(listeTaches));
  }, [listeTaches, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY_RELATIONS, JSON.stringify(listeRelations));
  }, [listeRelations, ready]);

  useEffect(() => {
    const handler = (e) => {
      if (triRef.current && !triRef.current.contains(e.target))       setShowTri(false);
      if (filtreRef.current && !filtreRef.current.contains(e.target)) setShowFiltre(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const supprimerDossier = (id) => setListeDossiers(listeDossiers.filter(d => d.id !== id));

  const modifierDossier = (id) => {
    const nouveauNom = prompt("Entrez le nouveau nom du dossier :");
    if (nouveauNom)
      setListeDossiers(listeDossiers.map(d => d.id === id ? { ...d, title: nouveauNom } : d));
  };

  const toggleTache = (id) => {
    setListeTaches(listeTaches.map(t =>
      t.id !== id ? t : { ...t, etat: t.etat === ETATS.REUSSI ? ETATS.NOUVEAU : ETATS.REUSSI }
    ));
  };

  const getDossierColor = (tacheId) => {
    const relation = listeRelations.find(r => r.tache === tacheId);
    if (!relation) return null;
    const dossier = listeDossiers.find(d => d.id === relation.dossier);
    return dossier ? dossier.color : null;
  };

  const getDossiersDeTache = (tacheId) =>
    listeRelations.filter(r => r.tache === tacheId).map(r => r.dossier);

  const toggleSet = (setter, val) => setter(prev => {
    const next = new Set(prev);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  });

  const uneSemaine = 7 * 24 * 60 * 60 * 1000;
  const maintenant = new Date();

  const estExpiree = (t) =>
    t.date_echeance && (maintenant - new Date(t.date_echeance)) > uneSemaine;

  let tachesAffichees = listeTaches.filter(t => {
    if (filtreEnCours && ETAT_TERMINE.includes(t.etat)) return false;
    if (!filtreExpirees && estExpiree(t)) return false;
    return true;
  });

  if (filtresDossiers.size > 0) {
    tachesAffichees = tachesAffichees.filter(t =>
      getDossiersDeTache(t.id).some(did => filtresDossiers.has(did))
    );
  }
  if (filtresEtats.size > 0) {
    tachesAffichees = tachesAffichees.filter(t => filtresEtats.has(t.etat));
  }

  const cleanTitle = (t) => t.title.replace(/^\d+\.\s*/, '');
  tachesAffichees = [...tachesAffichees].sort((a, b) => {
    if (triActif === TRIS.NOM)
      return cleanTitle(a).localeCompare(cleanTitle(b), 'fr');
    if (triActif === TRIS.DATE_ECHEANCE)
      return new Date(b.date_echeance) - new Date(a.date_echeance);
    return new Date(a.date_creation) - new Date(b.date_creation);
  });

  const nbFiltresActifs  = filtresDossiers.size + filtresEtats.size + (filtreEnCours ? 1 : 0) + (filtreExpirees ? 1 : 0);
  const etatsFiltrables  = Object.values(ETATS).filter(e => !ETAT_TERMINE.includes(e));

  const nbTotal      = listeTaches.length;
  const nbAffichees  = tachesAffichees.length;
  const nbTerminees  = listeTaches.filter(t => ETAT_TERMINE.includes(t.etat)).length;
  const nbEnCours    = listeTaches.filter(t => !ETAT_TERMINE.includes(t.etat)).length;

  const viewFolder = (f) => {
    const count = listeRelations.filter(rel => rel.dossier === f.id).length;
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
  };

  return (
    <div className="App">

      <Modal show={showModal} onHide={handleRestore} centered backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Restaurer les données ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Il existe deja des données. Voulez-vous les restaurer ou repartir de zéro ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={handleRestore}>
            Restaurer les données
          </Button>
        </Modal.Footer>
      </Modal>

      <Header
        setListeDossiers={setListeDossiers}
        setListeTaches={setListeTaches}
        setListeRelations={setListeRelations}
        listeDossiers={listeDossiers}
        listeTaches={listeTaches}
        listeRelations={listeRelations}
        datas={datas}
        STORAGE_KEY={STORAGE_KEY}
        STORAGE_KEY_TACHES={STORAGE_KEY_TACHES}
        STORAGE_KEY_RELATIONS={STORAGE_KEY_RELATIONS}
      />

      <div className="onglets-nav">
        <button
          className={`onglet-btn ${ongletActif === 'taches' ? 'onglet-actif' : ''}`}
          onClick={() => setOngletActif('taches')}
        >
          Tâches
        </button>
        <button
          className={`onglet-btn ${ongletActif === 'dossiers' ? 'onglet-actif' : ''}`}
          onClick={() => setOngletActif('dossiers')}
        >
          Dossiers
        </button>
      </div>

      <main>
        {ongletActif === 'dossiers' ? (
          <div className="onglet-dossiers">
            <div className="HeaderMain">
              <p>Dossiers</p>
            </div>
            <div className="dossiers-grille">
              {listeDossiers.map(viewFolder)}
            </div>
          </div>
        ) : (
          <>
            <div className="HeaderMain">
              <p>Tâches</p>
            </div>

            <div className="barre-actions">
              <div className="dropdown-wrapper" ref={triRef}>
                <button
                  className="btn-action"
                  onClick={() => { setShowTri(v => !v); setShowFiltre(false); }}
                >
                  Trier <span className="action-valeur"></span>
                </button>
                {showTri && (
                  <div className="dropdown-menu-custom">
                    {Object.values(TRIS).map(t => (
                      <button
                        key={t}
                        className={`dropdown-item-custom ${triActif === t ? 'actif' : ''}`}
                        onClick={() => { setTriActif(t); setShowTri(false); }}
                      >
                        {triActif === t && <span className="check">✓</span>}
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-wrapper" ref={filtreRef}>
                <button
                  className={`btn-action ${nbFiltresActifs > 0 ? 'btn-action-actif' : ''}`}
                  onClick={() => { setShowFiltre(v => !v); setShowTri(false); }}
                >
                  Filtrer
                </button>

                {showFiltre && (
                  <div className="dropdown-menu-custom dropdown-filtre">
                    <div className="filtre-section-label">Rapide</div>
                    <button
                      className={`dropdown-item-custom ${filtreEnCours ? 'actif' : ''}`}
                      onClick={() => setFiltreEnCours(v => !v)}
                    >
                      {filtreEnCours && <span className="check">✓</span>}
                      Non terminées seulement
                    </button>
                    <button
                      className={`dropdown-item-custom ${filtreExpirees ? 'actif' : ''}`}
                      onClick={() => setFiltreExpirees(v => !v)}
                    >
                      {filtreExpirees && <span className="check">✓</span>}
                      Afficher les expirées
                    </button>

                    <div className="filtre-separateur" />

                    <div className="filtre-section-label">Dossiers</div>
                    {listeDossiers.map(d => (
                      <button
                        key={d.id}
                        className={`dropdown-item-custom ${filtresDossiers.has(d.id) ? 'actif' : ''}`}
                        onClick={() => toggleSet(setFiltresDossiers, d.id)}
                      >
                        {filtresDossiers.has(d.id) && <span className="check">✓</span>}
                        <span className="dot-couleur" style={{ backgroundColor: d.color }} />
                        {d.title}
                      </button>
                    ))}

                    <div className="filtre-separateur" />

                    <div className="filtre-section-label">États</div>
                    {etatsFiltrables.map(e => (
                      <button
                        key={e}
                        className={`dropdown-item-custom ${filtresEtats.has(e) ? 'actif' : ''}`}
                        onClick={() => toggleSet(setFiltresEtats, e)}
                      >
                        {filtresEtats.has(e) && <span className="check">✓</span>}
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="taches-liste">
              {tachesAffichees.length === 0
                ? <p className="taches-vide">Aucune tâche à afficher.</p>
                : tachesAffichees.map(t => (
                    <Tache
                      key={t.id}
                      title={t.title}
                      etat={t.etat}
                      dateEcheance={t.date_echeance}
                      dossierColor={getDossierColor(t.id)}
                      onToggle={() => toggleTache(t.id)}
                    />
                  ))
              }
            </div>
          </>
        )}
      </main>

      <Footer
        nbTaches={nbTotal}
        nbAffichees={nbAffichees}
        nbTerminees={nbTerminees}
        nbEnCours={nbEnCours}
        nbDossiers={listeDossiers.length}
      />
    </div>
  );
}

export default App;