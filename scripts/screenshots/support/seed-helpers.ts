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
import {SavedFilterFactory} from '../factories/saved_filter'
import type {APIRequestContext, Page} from '@playwright/test'
import {Factory} from './factory'
import {readFileSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const DAY = 24 * 60 * 60 * 1000

/** Relative to now; the extra hour keeps "due today" tasks upcoming until the page renders. */
function inDays(days: number) {
  return new Date(Date.now() + days * DAY + 60 * 60 * 1000).toISOString()
}

const OFFICE_MOVE_TASKS = [
  // title, priority, due in days, gantt start/end in days (null = not on the chart)
  {title: 'Get quotes from moving companies', priority: 1, due: -3, gantt: [-8, -1]},
  {title: 'Notify building management', priority: 2, due: -1, gantt: [-5, 2]},
  {title: 'Update company address on website', priority: 3, due: 2, gantt: null, done: true},
  {title: 'Order new desk furniture', priority: 4, due: 4, gantt: [1, 9]},
  {title: 'Set up meeting rooms', priority: 5, due: 6, gantt: [4, 13]},
  {title: 'Pack shared kitchen supplies', priority: 0, due: 8, gantt: [7, 12]},
  {title: 'Label boxes by department', priority: 1, due: 10, gantt: null},
  {title: 'Schedule elevator for moving day', priority: 2, due: 12, gantt: [10, 16]},
]

const OTHER_TASKS = [
  {project: 2, title: 'Book retreat venue', priority: 2, due: 1},
  {project: 2, title: 'Confirm catering for retreat', priority: 5, due: 3},
  {project: 2, title: 'Send agenda to team', priority: 0, due: 5},
  {project: 3, title: 'Schedule dentist appointment', priority: 0, due: -4},
  {project: 3, title: 'Renew parking permit', priority: 4, due: null},
]

/**
 * The data every screenshot starts from, seeded fresh before each test (see fixtures.ts).
 * Specs add their own extras on top with truncate=false and ids that don't clash.
 */
export async function seedBaseData() {
  const extraUsers = await createExtraUsers()

  const projects = await ProjectFactory.create(3, {
    title: (i: number) => ['Office Move', 'Team Retreat Planning', 'Personal'][i - 1],
  })
  const views = []
  for (let i = 0; i < projects.length; i++) {
    views.push(await createDefaultViews(projects[i].id as number, i * 4 + 1, i === 0))
  }

  const officeMove = OFFICE_MOVE_TASKS.map((t, i) => ({...t, id: i + 1, project: 1, index: i + 1}))
  const others = OTHER_TASKS.map((t, i) => ({...t, id: officeMove.length + i + 1, index: i + 1, gantt: null, done: false}))
  const all = [...officeMove, ...others]
  const tasks = await TaskFactory.create(all.length, {
    id: (i: number) => all[i - 1].id,
    project_id: (i: number) => all[i - 1].project,
    index: (i: number) => all[i - 1].index,
    title: (i: number) => all[i - 1].title,
    priority: (i: number) => all[i - 1].priority,
    done: (i: number) => all[i - 1].done ?? false,
    due_date: (i: number) => (all[i - 1].due === null ? null : inDays(all[i - 1].due!)),
    start_date: (i: number) => (all[i - 1].gantt ? inDays(all[i - 1].gantt![0]) : null),
    end_date: (i: number) => (all[i - 1].gantt ? inDays(all[i - 1].gantt![1]) : null),
    created: new Date(Date.now() - 10 * DAY).toISOString(),
    updated: new Date(Date.now() - 2 * DAY).toISOString(),
  })

  const labels = await createLabels(tasks.slice(0, 4))

  const buckets = await BucketFactory.create(3, {
    project_view_id: views[0].kanban.id,
    title: (i: number) => ['To Do', 'In Progress', 'Done'][i - 1],
  })
  await TaskBucketFactory.create(officeMove.length, {
    task_id: (i: number) => i,
    bucket_id: (i: number) => buckets[i <= 4 ? 0 : i <= 6 ? 1 : 2].id,
    project_view_id: views[0].kanban.id,
  })

  await TaskAssigneeFactory.create(2, {
    task_id: (i: number) => tasks[i - 1].id,
    user_id: (i: number) => extraUsers[i - 1].id,
  })
  await createComments(tasks[0], extraUsers[0])
  await createAttachment(tasks[0])
  await createSavedFilter()

  return {
    project: projects[0],
    views: views[0],
    tasks: tasks.slice(0, officeMove.length),
    projects,
    allViews: views,
    allTasks: tasks,
    labels,
    buckets,
    extraUsers,
  }
}

export type BaseData = Awaited<ReturnType<typeof seedBaseData>>

/** Labels Urgent, On hold, Urgent, Waiting on others on the given four tasks. */
export async function createLabels(tasks: Record<string, unknown>[]) {
  const labels = await LabelFactory.create(4, {
    created_by_id: 1,
    title: (i: number) => ['Urgent', 'Waiting on others', 'On hold', 'Needs approval'][i - 1],
    hex_color: (i: number) => ['e8445a', '1973ff', '4caf50', 'ff9800'][i - 1],
  })
  const labelIndexes = [0, 2, 0, 1]
  await LabelTaskFactory.create(tasks.length, {
    task_id: (i: number) => tasks[i - 1].id,
    label_id: (i: number) => labels[labelIndexes[i - 1]].id,
  })
  return labels
}

export async function createExtraUsers() {
  return UserFactory.create(3, {
    id: (i: number) => 100 + i,
    username: (i: number) => ['sarah', 'david', 'emma'][i - 1],
    name: (i: number) => ['Sarah Miller', 'David Park', 'Emma Thompson'][i - 1],
  }, false)
}

export async function createComments(task: Record<string, unknown>, author: Record<string, unknown>) {
  await TaskCommentFactory.create(2, {
    task_id: task.id,
    author_id: (i: number) => [author.id, 1][i - 1],
    comment: (i: number) => [
      'I got three quotes — the one from CityMovers looks best. Can you review?',
      'Looks good, let\'s go with that. I\'ll send them the confirmation.',
    ][i - 1],
  })
}

export async function createSavedFilter() {
  return SavedFilterFactory.create(1, {
    title: 'My Open Tasks',
    filters: '{"done":false}',
    owner_id: 1,
  })
}

/** Attachment metadata only: enough for the paperclip icon, the file itself doesn't exist. High ids stay clear of the sequence used by real uploads. */
export async function createAttachment(task: Record<string, unknown>) {
  const now = new Date().toISOString()
  await Factory.seed('files', [{id: 1000, name: 'moving-quotes.pdf', mime: 'application/pdf', size: 48213, created: now, created_by_id: 1}])
  await Factory.seed('task_attachments', [{id: 1000, task_id: task.id, file_id: 1000, created_by_id: 1, created: now}])
}

export async function uploadAttachment(apiContext: APIRequestContext, token: string, taskId: unknown) {
  const response = await apiContext.put(`tasks/${taskId}/attachments`, {
    headers: {Authorization: `Bearer ${token}`},
    multipart: {
      files: {
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: readFileSync(join(__dirname, 'test-image.jpg')),
      },
    },
  })
  return (await response.json()).success[0].id as number
}

/** Fills the dashboard's "Last viewed" section. */
export async function visitAllProjects(page: Page, base: BaseData) {
  for (let i = 0; i < base.projects.length; i++) {
    await page.goto(`/projects/${base.projects[i].id}/${base.allViews[i].list.id}`)
    await page.waitForLoadState('networkidle')
  }
}
