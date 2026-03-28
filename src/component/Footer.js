export function Footer({ nbTaches, nbAffichees, nbTerminees, nbEnCours, nbDossiers }) {
  return (
    <div className="App-footer">
      <p>Tâches  au Total : {nbTaches} — Tâches de avec filtre : {nbAffichees} — Tâches de terminées : {nbTerminees} — Tâches en cours : {nbEnCours} —Dossiers : {nbDossiers}</p>
    </div>
  );
}
