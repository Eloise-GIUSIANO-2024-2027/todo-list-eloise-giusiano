import iconeModif from '../Pictures/modif.svg';
import iconeBin from '../Pictures/bin.svg';
export const Folder = ({ title, taskCount, color, onDelete, onEdit }) => {
  const cleanTitle = title.replace(/^\d+\.\s*/, '');

  const colorsMap = {
    orange: "#ffa500",
    pink: "#ffc0cb",
    bluesky: "#4cc9f0",
    green: "#2ecc71"
  };

  const finalColor = colorsMap[color] || color || "#8a2be2";

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