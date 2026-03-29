import { ETATS } from './Etats.js';

const COLORS_MAP = {
    orange:  '#e87e47',
    pink:    '#fb6f92',
    bluesky: '#8fb6d8',
    green:   '#6ea89e',
    violet:  '#75619d',
};

export const Tache = ({ title, etat, dateEcheance, dossierColor, onToggle }) => {
    const cleanTitle = title.replace(/^\d+\.\s*/, '');
    const color = COLORS_MAP[dossierColor] || dossierColor || '#cccccc';

    const echeance = dateEcheance ? new Date(dateEcheance) : null;
    const today = new Date();
    const isLate = echeance && echeance < today;

    const isDone = etat === ETATS.REUSSI;

    return (
        <div className={`tache-card ${isDone ? 'tache-done' : ''}`}>
            <div className="tache-color-block" style={{ backgroundColor: color }} />

            <div className="tache-content">
                <span className="tache-title">{cleanTitle}</span>
                {echeance && (
                    <span className={`tache-date ${isLate && !isDone ? 'late' : ''}`}>
                        Date : {echeance.toLocaleDateString('fr-FR')}
                    </span>
                )}
            </div>

            <input
                type="checkbox"
                className="tache-checkbox"
                checked={isDone}
                onChange={onToggle}
            />
        </div>
    );
}