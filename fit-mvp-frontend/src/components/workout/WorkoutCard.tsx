import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Flame, CheckCircle, PlayCircle, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import type { WorkoutResponse as Workout, ExerciseResponse as Exercise } from '@fitness/api-client';
import { useState } from 'react';

interface WorkoutCardProps {
  workout: Workout;
  onComplete?: (workoutId: string) => void;
  onStart?: (workoutId: string) => void;
  onToggleExercise: (workoutId: string, exerciseId: string, completed: boolean) => void;
  compact?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  onComplete, 
  onStart, 
  onToggleExercise,
  compact = false 
}) => {
  const [showExercises, setShowExercises] = useState(!compact);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const completedExercisesCount = workout.exercises.filter(ex => ex.completed).length;
  const totalExercises = workout.exercises.length;
  const allExercisesCompleted = completedExercisesCount === totalExercises && totalExercises > 0;

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-lg break-words">{workout.name}</h3>
               <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                 <div className="flex items-center gap-1">
                   <Clock className="h-4 w-4" />
                   <span>{workout.duration || 45} min</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <Flame className="h-4 w-4" />
                   <span>{workout.caloriesBurned || 250} cal</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <Dumbbell className="h-4 w-4" />
                   <span>{completedExercisesCount}/{totalExercises} ex</span>
                 </div>
               </div>
               {!workout.completed && totalExercises > 0 && (
                 <div className="mt-2 text-sm">
                   <span className={`font-medium ${allExercisesCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                     {allExercisesCompleted ? 'All exercises done!' : `${completedExercisesCount} of ${totalExercises} completed`}
                   </span>
                 </div>
               )}
            </div>
            <div className="flex flex-col items-end ml-2">
              <Badge variant={workout.completed ? "default" : "outline"} className="mb-2">
                {workout.completed ? 'Completed' : 'Pending'}
              </Badge>
              {!workout.completed && onStart && (
                <Button size="sm" onClick={() => onStart(workout.id)}>
                  Start
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
         <div className="flex flex-wrap justify-between items-center gap-2">
           <div className="min-w-0 flex-1">
             <CardTitle className="text-xl break-words">{workout.name}</CardTitle>
             <CardDescription className="flex items-center gap-2 mt-1">
               <Calendar className="h-4 w-4" />
               {formatDate(workout.workoutDate)}
             </CardDescription>
           </div>
           <Badge variant={workout.completed ? "default" : "outline"} className="shrink-0">
             {workout.completed ? 'Completed' : 'Pending'}
           </Badge>
         </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Duration</span>
            </div>
            <div className="font-semibold">{workout.duration || 45} min</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Flame className="h-4 w-4" />
              <span className="text-sm">Calories</span>
            </div>
            <div className="font-semibold">{workout.caloriesBurned || 250} cal</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 text-sm mb-1">Exercises</div>
            <div className="font-semibold">{completedExercisesCount}/{totalExercises}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 text-sm mb-1">Status</div>
            <div className="font-semibold">{workout.completed ? 'Done' : allExercisesCompleted ? 'Ready to Finish' : 'In Progress'}</div>
          </div>
        </div>

        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExercises(!showExercises)}
            className="mb-4 flex items-center gap-2"
          >
            {showExercises ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Exercises
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Exercises
              </>
            )}
            <span className="ml-1">({completedExercisesCount}/{totalExercises})</span>
          </Button>
          
          {showExercises && (
            <div className="space-y-3">
              {workout.exercises.map((exercise: Exercise, index: number) => (
                <ExerciseItem 
                  key={exercise.id || index} 
                  exercise={exercise}
                  workoutId={workout.id}
                  onToggle={onToggleExercise}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {!workout.completed && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => onStart && onStart(workout.id)}
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Start Workout
          </Button>
          <Button 
            onClick={() => onComplete && onComplete(workout.id)}
            className="flex items-center gap-2"
            disabled={!allExercisesCompleted}
          >
            <CheckCircle className="h-4 w-4" />
            Mark Complete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

interface ExerciseItemProps {
  exercise: Exercise;
  workoutId: string;
  onToggle?: (workoutId: string, exerciseId: string, completed: boolean) => void;
  disabled?: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, workoutId, onToggle, disabled }) => {
  const handleToggle = (checked: boolean) => {
    if (onToggle && !disabled) {
      onToggle(workoutId, exercise.id, checked);
    }
  };

  return (
    <div className={`border-l-4 pl-4 py-2 ${exercise.completed ? 'border-green-500 bg-green-50/50' : 'border-blue-500'}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Checkbox 
            id={`exercise-${exercise.id}`}
            checked={exercise.completed}
            onCheckedChange={handleToggle}
            // disabled={disabled}
            className="mt-1 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <label 
              htmlFor={`exercise-${exercise.id}`}
              className={`font-medium break-words cursor-pointer ${exercise.completed ? 'line-through text-gray-500' : ''}`}
            >
              {exercise.name}
            </label>
            {exercise.description && (
              <p className={`text-sm mt-1 break-words ${exercise.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {exercise.description}
              </p>
            )}
            {exercise.completed && exercise.completedAt && (
              <p className="text-xs text-green-600 mt-1">
                Completed {new Date(exercise.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
        <Badge variant="outline" className="shrink-0">
          {exercise.locationType}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-sm ml-7">
        <div className={`text-center py-1 rounded ${exercise.completed ? 'bg-green-100' : 'bg-gray-50'}`}>
          <div className={`font-semibold ${exercise.completed ? 'text-green-700' : ''}`}>{exercise.sets}</div>
          <div className={`text-xs ${exercise.completed ? 'text-green-600' : 'text-gray-600'}`}>Sets</div>
        </div>
        <div className={`text-center py-1 rounded ${exercise.completed ? 'bg-green-100' : 'bg-gray-50'}`}>
          <div className={`font-semibold ${exercise.completed ? 'text-green-700' : ''}`}>{exercise.reps}</div>
          <div className={`text-xs ${exercise.completed ? 'text-green-600' : 'text-gray-600'}`}>Reps</div>
        </div>
        <div className={`text-center py-1 rounded ${exercise.completed ? 'bg-green-100' : 'bg-gray-50'}`}>
          <div className={`font-semibold break-words px-1 ${exercise.completed ? 'text-green-700' : ''}`}>{exercise.weight || '—'}</div>
          <div className={`text-xs ${exercise.completed ? 'text-green-600' : 'text-gray-600'}`}>Weight</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
