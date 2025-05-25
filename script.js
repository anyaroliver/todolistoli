document.addEventListener('DOMContentLoaded', () => {
    const muscleGroupSelect = document.getElementById('muscleGroupSelect');
    const exerciseSelect = document.getElementById('exerciseSelect');
    const setsInput = document.getElementById('setsInput');
    const repsInput = document.getElementById('repsInput');
    const daySelect = document.getElementById('daySelect');
    const addTaskButton = document.getElementById('addTask');
    const prevWeekButton = document.getElementById('prevWeek');
    const nextWeekButton = document.getElementById('nextWeek');
    const currentWeekElement = document.getElementById('currentWeek');

    // Exercise database with image icons (all use media/default.png for now)
    const defaultImg = 'media/bench.webp';
    const exercises = {
        chest: [
            { name: 'Bench Press', img: defaultImg },
            { name: 'Incline Bench Press', img: defaultImg },  
            { name: 'Decline Bench Press', img: defaultImg },
            { name: 'Dumbbell Flyes', img: defaultImg },
            { name: 'Cable Flyes', img: defaultImg },
            { name: 'Push-ups', img: defaultImg },
            { name: 'Dumbbell Press', img: defaultImg },
            { name: 'Machine Chest Press', img: defaultImg }
        ],
        back: [
            { name: 'Pull-ups', img: defaultImg },
            { name: 'Lat Pulldowns', img: defaultImg },
            { name: 'Barbell Rows', img: defaultImg },
            { name: 'Dumbbell Rows', img: defaultImg },
            { name: 'T-Bar Rows', img: defaultImg },
            { name: 'Face Pulls', img: defaultImg },
            { name: 'Deadlifts', img: defaultImg },
            { name: 'Cable Rows', img: defaultImg }
        ],
        shoulders: [
            { name: 'Overhead Press', img: defaultImg },
            { name: 'Lateral Raises', img: defaultImg },
            { name: 'Front Raises', img: defaultImg },
            { name: 'Reverse Flyes', img: defaultImg },
            { name: 'Arnold Press', img: defaultImg },
            { name: 'Upright Rows', img: defaultImg },
            { name: 'Face Pulls', img: defaultImg },
            { name: 'Shrugs', img: defaultImg }
        ],
        legs: [
            { name: 'Squats', img: defaultImg },
            { name: 'Deadlifts', img: defaultImg },
            { name: 'Leg Press', img: defaultImg },
            { name: 'Lunges', img: defaultImg },
            { name: 'Leg Extensions', img: defaultImg },
            { name: 'Leg Curls', img: defaultImg },
            { name: 'Calf Raises', img: defaultImg },
            { name: 'Romanian Deadlifts', img: defaultImg }
        ],
        arms: [
            { name: 'Bicep Curls', img: defaultImg },
            { name: 'Tricep Pushdowns', img: defaultImg },
            { name: 'Hammer Curls', img: defaultImg },
            { name: 'Skull Crushers', img: defaultImg },
            { name: 'Preacher Curls', img: defaultImg },
            { name: 'Diamond Push-ups', img: defaultImg },
            { name: 'Concentration Curls', img: defaultImg },
            { name: 'Tricep Dips', img: defaultImg }
        ],
        core: [
            { name: 'Planks', img: defaultImg },
            { name: 'Crunches', img: defaultImg },
            { name: 'Russian Twists', img: defaultImg },
            { name: 'Leg Raises', img: defaultImg },
            { name: 'Mountain Climbers', img: defaultImg },
            { name: 'Ab Wheel Rollouts', img: defaultImg },
            { name: 'Cable Woodchops', img: defaultImg },
            { name: 'Hanging Leg Raises', img: defaultImg }
        ]
    };

    let currentWeek = 1;
    let workouts = JSON.parse(localStorage.getItem('workouts')) || {};

    // Initialize current week if not exists
    if (!workouts[currentWeek]) {
        workouts[currentWeek] = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };
    }

    // Function to populate exercise select based on muscle group
    const populateExercises = () => {
        const muscleGroup = muscleGroupSelect.value;
        exerciseSelect.innerHTML = '<option value="">Select Exercise</option>';
        
        if (muscleGroup && exercises[muscleGroup]) {
            exerciseSelect.disabled = false;
            exercises[muscleGroup].forEach(exercise => {
                const option = document.createElement('option');
                option.value = JSON.stringify(exercise);
                option.innerHTML = `<img src='${exercise.img}' class='exercise-img-option' alt='icon'> ${exercise.name}`;
                exerciseSelect.appendChild(option);
            });
        } else {
            exerciseSelect.disabled = true;
        }
    };

    // Function to save workouts to localStorage
    const saveWorkouts = () => {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    };

    // Function to create workout element
    const createWorkoutElement = (workout, day, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${workout.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = workout.completed;
        checkbox.addEventListener('change', () => toggleWorkout(day, index));

        const exerciseDetails = document.createElement('div');
        exerciseDetails.className = 'exercise-details';

        const exerciseName = document.createElement('span');
        exerciseName.className = 'exercise-name';
        exerciseName.innerHTML = `<img src='${workout.img}' class='exercise-img' alt='icon'> ${workout.name}`;

        const exerciseSetsReps = document.createElement('span');
        exerciseSetsReps.className = 'exercise-sets-reps';
        exerciseSetsReps.textContent = `${workout.sets} sets × ${workout.reps} reps`;

        exerciseDetails.appendChild(exerciseName);
        exerciseDetails.appendChild(exerciseSetsReps);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', () => deleteWorkout(day, index));

        li.appendChild(checkbox);
        li.appendChild(exerciseDetails);
        li.appendChild(deleteButton);
        return li;
    };

    // Function to render workouts for a specific day
    const renderDayWorkouts = (day) => {
        const daySection = document.getElementById(day);
        const taskList = daySection.querySelector('.task-list');
        taskList.innerHTML = '';
        
        workouts[currentWeek][day].forEach((workout, index) => {
            const workoutElement = createWorkoutElement(workout, day, index);
            taskList.appendChild(workoutElement);
        });
    };

    // Function to render all workouts
    const renderAllWorkouts = () => {
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
            renderDayWorkouts(day);
        });
    };

    // Function to add a new workout
    const addWorkout = () => {
        const exerciseData = JSON.parse(exerciseSelect.value);
        const sets = setsInput.value.trim();
        const reps = repsInput.value.trim();
        const day = daySelect.value;

        if (exerciseData && sets && reps && day !== 'sunday') {
            const workout = {
                name: exerciseData.name,
                img: exerciseData.img,
                sets,
                reps,
                completed: false
            };

            workouts[currentWeek][day].push(workout);
            exerciseSelect.value = '';
            setsInput.value = '';
            repsInput.value = '';
            muscleGroupSelect.value = '';
            exerciseSelect.disabled = true;
            saveWorkouts();
            renderDayWorkouts(day);
            muscleGroupSelect.focus();
        }
    };

    // Function to toggle workout completion
    const toggleWorkout = (day, index) => {
        workouts[currentWeek][day][index].completed = !workouts[currentWeek][day][index].completed;
        saveWorkouts();
        renderDayWorkouts(day);
    };

    // Function to delete a workout with animation
    const deleteWorkout = (day, index) => {
        const daySection = document.getElementById(day);
        const taskList = daySection.querySelector('.task-list');
        const workoutElement = taskList.children[index];
        
        workoutElement.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            workouts[currentWeek][day].splice(index, 1);
            saveWorkouts();
            renderDayWorkouts(day);
        }, 300);
    };

    // Function to change week
    const changeWeek = (direction) => {
        currentWeek += direction;
        if (currentWeek < 1) currentWeek = 1;
        
        if (!workouts[currentWeek]) {
            workouts[currentWeek] = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
            };
        }
        
        currentWeekElement.textContent = `Week ${currentWeek}`;
        saveWorkouts();
        renderAllWorkouts();
    };

    // Event listeners
    muscleGroupSelect.addEventListener('change', populateExercises);
    addTaskButton.addEventListener('click', addWorkout);
    exerciseSelect.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWorkout();
        }
    });
    prevWeekButton.addEventListener('click', () => changeWeek(-1));
    nextWeekButton.addEventListener('click', () => changeWeek(1));

    // Focus muscle group select on load
    muscleGroupSelect.focus();

    // Initial render
    renderAllWorkouts();
}); 