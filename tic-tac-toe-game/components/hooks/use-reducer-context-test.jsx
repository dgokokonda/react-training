import AddTask from "./AddTaskWithContext.js";
import TaskList from "./TaskListWithContext.js";
import { TasksProvider } from "./TasksContext.js";

export function UseReducerContextTest() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
