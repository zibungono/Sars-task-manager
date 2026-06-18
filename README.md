# Daily Task Manager

A simple HTML, CSS and JavaScript task management app created for a UX/front-end case study.

## Features

- Add a task with a required due date
- View tasks grouped by due date
- Mark tasks as complete
- See a clear alert for tasks due today
- See lighter status badges for upcoming tasks
- Track the percentage of tasks due today that have been completed
- Populate sample tasks for a quick interview/demo walkthrough
- Clear all tasks to reset the demo
- Save tasks in the browser using `localStorage`

## How to run the app

1. Download or clone the repository.
2. Open the `daily-task-manager` folder.
3. Double-click `index.html` to open it in a browser.

No server or build tools are required.

## How the app works

The app stores tasks as JavaScript objects with four main properties:

```js
{
  id: number,
  title: string,
  dueDate: string,
  completed: boolean
}
```

When a user adds a task, the task is saved to `localStorage`, displayed in the task list, and grouped by due date. The progress card only calculates tasks due today, making the dashboard more useful for daily planning.

## Demo controls

Use **Populate demo tasks** to generate example tasks spread across today and the next four days. Use **Clear all tasks** to reset the app before another demo.

## Files

- `index.html` - page structure
- `styles.css` - visual design and responsive styling
- `script.js` - task logic, localStorage, due-date grouping and demo actions
