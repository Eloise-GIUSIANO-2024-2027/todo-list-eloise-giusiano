export const Tache = ({ id, title }) => {
    const cleanTitle = title.replace(/^\d+\.\s*/, '')
    return (
        <p>{id} - {cleanTitle}</p>
    )
}