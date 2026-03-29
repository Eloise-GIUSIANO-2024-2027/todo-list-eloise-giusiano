import iconeModif from '../Pictures/modif.svg';
import iconeBin from '../Pictures/bin.svg';

export const Folder = ({ title, taskCount, color, onDelete, onEdit }) => {
  const cleanTitle = title.replace(/^\d+\.\s*/, '');

  const colorsMap = {
    orange: "#e87e47",
    pink: "#fb6f92",
    bluesky: "#8fb6d8",
    green: "#6ea89e",
    violet: "#75619d"
  };

  const finalColor = colorsMap[color] || color || "#75619d";

  return (
    <div 
      className="Folder-container" 
      style={{ backgroundColor: finalColor }} 
    >
      <div className="Folder-actions">
        <button className="btn-modifier" onClick={onEdit}>
          <img src={iconeModif} alt="Modifier" className="folder-icon" />
        </button>
        <button className="btn-supprimer" onClick={onDelete}>
          <img src={iconeBin} alt="Supprimer" className="folder-icon" />
        </button>
      </div>

      <p className="Folder-Title">{cleanTitle}</p>

      <div className="Folder-counter">
        {taskCount} tâche{taskCount > 1 ? 's' : ''}
      </div>
    </div>
  );
};