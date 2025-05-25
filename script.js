document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const setsInput = document.getElementById('setsInput');
    const repsInput = document.getElementById('repsInput');
    const daySelect = document.getElementById('daySelect');
    const addTaskButton = document.getElementById('addTask');
    const prevWeekButton = document.getElementById('prevWeek');
    const nextWeekButton = document.getElementById('nextWeek');
    const currentWeekElement = document.getElementById('currentWeek');

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
        exerciseName.textContent = workout.name;

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
        const name = taskInput.value.trim();
        const sets = setsInput.value.trim();
        const reps = repsInput.value.trim();
        const day = daySelect.value;

        if (name && sets && reps && day !== 'sunday') {
            const workout = {
                name,
                sets,
                reps,
                completed: false
            };

            workouts[currentWeek][day].push(workout);
            taskInput.value = '';
            setsInput.value = '';
            repsInput.value = '';
            saveWorkouts();
            renderDayWorkouts(day);
            taskInput.focus();
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
    addTaskButton.addEventListener('click', addWorkout);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWorkout();
        }
    });
    prevWeekButton.addEventListener('click', () => changeWeek(-1));
    nextWeekButton.addEventListener('click', () => changeWeek(1));

    // Focus input on load
    taskInput.focus();

    // Initial render
    renderAllWorkouts();
}); 