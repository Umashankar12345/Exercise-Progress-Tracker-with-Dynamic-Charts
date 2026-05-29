export const ExerciseCard = ({ exercise }) => {
    return (
        <div className="exercise-card">
            <h3>{exercise?.name || 'Exercise Name'}</h3>
            <p>{exercise?.muscle_group || 'Muscle Group'}</p>
        </div>
    );
};
