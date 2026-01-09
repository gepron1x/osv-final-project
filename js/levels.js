const LEVELS = {
    'Beginner': 0,
    'Intermediate': 1,
    'Advanced': 2
};


function tutorSuitable(tutor_level, course_level) {
    return LEVELS[tutor_level] >= LEVELS[course_level];
}