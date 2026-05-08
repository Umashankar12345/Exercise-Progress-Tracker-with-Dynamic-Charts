/**
 * Calculates the One-Rep Max (1RM) using the Epley formula.
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 * @returns {number} Estimated 1RM
 */
export const calculate1RM = (weight, reps) => {
    if (reps === 1) return weight;
    return weight * (1 + (reps / 30));
};

/**
 * Calculates total volume for a list of sets.
 * @param {Array<{weight: number, reps: number}>} sets 
 * @returns {number} Total volume (weight * reps)
 */
export const calculateVolume = (sets) => {
    return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};
