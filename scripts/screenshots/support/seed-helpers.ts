import {ProjectFactory} from '../factories/project'
import {ProjectViewFactory} from '../factories/project_view'
import {TaskFactory} from '../factories/task'
import {BucketFactory} from '../factories/bucket'
import {TaskBucketFactory} from '../factories/task_buckets'
import {LabelFactory} from '../factories/labels'
import {LabelTaskFactory} from '../factories/label_task'
import {TaskAssigneeFactory} from '../factories/task_assignee'
import {UserFactory} from '../factories/user'
import {TaskCommentFactory} from '../factories/task_comment'

// View kinds
export const VIEW_LIST = 0
export const VIEW_GANTT = 1
export const VIEW_TABLE = 2
export const VIEW_KANBAN = 3

export async function createDefaultViews(projectId: number, startViewId = 1, truncate = true) {
  if (truncate) await ProjectViewFactory.truncate()

  const list = await ProjectViewFactory.create(1, {
    id: startViewId, project_id: projectId, view_kind: VIEW_LIST, title: 'List',
  }, false)
  const gantt = await ProjectViewFactory.create(1, {
    id: startViewId + 1, project_id: projectId, view_kind: VIEW_GANTT, title: 'Gantt',
  }, false)
  const table = await ProjectViewFactory.create(1, {
    id: startViewId + 2, project_id: projectId, view_kind: VIEW_TABLE, title: 'Table',
  }, false)
  const kanban = await ProjectViewFactory.create(1, {
    id: startViewId + 3, project_id: projectId, view_kind: VIEW_KANBAN, title: 'Kanban',
    bucket_configuration_mode: 1,
  }, false)

  return {list: list[0], gantt: gantt[0], table: table[0], kanban: kanban[0]}
}

/**
 * Create a fully populated project with tasks, labels, assignees —
 * suitable for most screenshot scenarios.
 */
export async function createPopulatedProject(opts: {
  taskCount?: number,
  withLabels?: boolean,
  withAssignees?: boolean,
  withComments?: boolean,
  withDueDates?: boolean,
  withKanban?: boolean,
} = {}) {
  const {
    taskCount = 8,
    withLabels = true,
    withAssignees = false,
    withComments = false,
    withDueDates = true,
    withKanban = true,
  } = opts

  const projects = await ProjectFactory.create(1, {title: 'Office Move'})
  const project = projects[0]
  const views = await createDefaultViews(project.id as number)

  // Create tasks with realistic titles
  const taskTitles = [
    'Get quotes from moving companies',
    'Notify building management',
    'Update company address on website',
    'Order new desk furniture',
    'Set up meeting rooms',
    'Pack shared kitchen supplies',
    'Label boxes by department',
    'Schedule elevator for moving day',
    'Transfer phone and internet lines',
    'Hand in old office keys',
    'Create new seating chart',
    'Send moving day instructions to staff',
  ]

  const now = new Date()
  const tasks = await TaskFactory.create(taskCount, {
    project_id: project.id,
    title: (i: number) => taskTitles[(i - 1) % taskTitles.length],
    done: (i: number) => i === 3, // One task marked done
    priority: (i: number) => [0, 1, 2, 3, 4, 5][i % 6],
    due_date: withDueDates
      ? (i: number) => {
          const d = new Date(now)
          d.setDate(d.getDate() + (i * 2) - 4) // Some past, some future
          return d.toISOString()
        }
      : undefined,
  })

  let labels: Record<string, unknown>[] = []
  if (withLabels) {
    labels = await LabelFactory.create(4, {
      created_by_id: 1,
      title: (i: number) => ['Urgent', 'Waiting on others', 'On hold', 'Needs approval'][i - 1],
      hex_color: (i: number) => ['e8445a', '1973ff', '4caf50', 'ff9800'][i - 1],
    })
    // Assign labels to some tasks (first call truncates the table)
    await LabelTaskFactory.create(1, {id: 1, task_id: tasks[0].id, label_id: labels[0].id})
    await LabelTaskFactory.create(1, {id: 2, task_id: tasks[1].id, label_id: labels[2].id}, false)
    await LabelTaskFactory.create(1, {id: 3, task_id: tasks[2].id, label_id: labels[0].id}, false)
    await LabelTaskFactory.create(1, {id: 4, task_id: tasks[3].id, label_id: labels[1].id}, false)
  }

  if (withKanban) {
    const buckets = await BucketFactory.create(3, {
      project_view_id: views.kanban.id,
      title: (i: number) => ['To Do', 'In Progress', 'Done'][i - 1],
    })
    // Distribute tasks across buckets (first call truncates)
    for (let i = 0; i < tasks.length; i++) {
      const bucketIndex = i < 4 ? 0 : i < 6 ? 1 : 2
      await TaskBucketFactory.create(1, {
        task_id: tasks[i].id,
        bucket_id: buckets[bucketIndex].id,
        project_view_id: views.kanban.id,
      }, i === 0)
    }
  }

  // Always create extra users so they are available for comments, assignees, etc.
  const extraUsers = await UserFactory.create(3, {
    id: (i: number) => 100 + i,
    username: (i: number) => ['sarah', 'david', 'emma'][i - 1],
    name: (i: number) => ['Sarah Miller', 'David Park', 'Emma Thompson'][i - 1],
  }, false)

  if (withAssignees) {
    await TaskAssigneeFactory.create(1, {task_id: tasks[0].id, user_id: extraUsers[0].id})
    await TaskAssigneeFactory.create(1, {id: 2, task_id: tasks[1].id, user_id: extraUsers[1].id}, false)
  }

  if (withComments) {
    await TaskCommentFactory.create(2, {
      task_id: tasks[0].id,
      author_id: (i: number) => [extraUsers[0].id, 1][i - 1],
      comment: (i: number) => [
        'I got three quotes — the one from CityMovers looks best. Can you review?',
        'Looks good, let\'s go with that. I\'ll send them the confirmation.',
      ][i - 1],
    })
  }

  return {project, views, tasks, labels, extraUsers}
}
