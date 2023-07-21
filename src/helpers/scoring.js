export const calculateScore = (isOpen, timeUntilOpen, distance) => {
    // Part 1: Open score
    let openScore;
    if (isOpen) {
        openScore = 1;
    } else {
        if (timeUntilOpen <= 0) {
            openScore = 0;
        } else if (timeUntilOpen >= 1) {
            openScore = 0;
        } else {
            openScore = 1 - timeUntilOpen / 1;
        }
    }

    // Part 2: Proximity score
    let proximityScore;
    if (distance <= 0) {
        proximityScore = 1;
    } else if (distance >= 0.05) {
        proximityScore = 0;
    } else {
        proximityScore = 1 - distance / 0.05;
    }

    // Calculate the overall score
    const score = (openScore + proximityScore) / 2;

    return score;
}