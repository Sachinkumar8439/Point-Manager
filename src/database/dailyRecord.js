// dailyRecord.js
import { getDB } from "./db";
import { getTasksForMember } from "./task";
import { syncMonthlyReport } from "./report";

const STORE = "dailyRecords";

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

// =====================================
// Create Today Record
// =====================================

export async function createTodayRecord(member) {
  const db = await getDB();
  const date = todayDate();
  const id = `${member.id}_${date}`;

  // Check if record already exists
  const exist = await db.get(STORE, id);
  if (exist) return exist;

  // 🔥 IMPORTANT: Sync monthly report before creating today's record
  try {
    await syncMonthlyReport(member);
  } catch (error) {
    console.error("Failed to sync monthly report:", error);
  }

  // Get member's tasks
  const memberTasks = await getTasksForMember(member);

  const tasks = memberTasks.map(task => ({
    taskId: task.id,
    title: task.title,
    icon: task.icon,
    points: task.points,
    hasTimeRange: task.hasTimeRange,
    startTime: task.startTime,
    endTime: task.endTime,
    status: "done", // Start as pending
    autoCompleted: false,
    completedAt: null,
    name: task.name,
  }));

  const record = {
    id,
    memberId: member.id,
    date,
    tasks,
    manualPoints: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db.add(STORE, record);
  return record;
}

// =====================================
// Get Today Record
// =====================================

export async function getTodayRecord(memberId) {
  const db = await getDB();
  return await db.get(STORE, `${memberId}_${todayDate()}`);
}

// =====================================
// Get Record by Date
// =====================================

export async function getRecordByDate(memberId, date) {
  const db = await getDB();
  return await db.get(STORE, `${memberId}_${date}`);
}

// =====================================
// Create If Missing
// =====================================

export async function ensureTodayRecord(member) {
  let record = await getTodayRecord(member.id);
  if (!record) {
    record = await createTodayRecord(member);
  }
  return record;
}

// =====================================
// Save Record
// =====================================

async function save(record) {
  const db = await getDB();
  record.updatedAt = Date.now();
  await db.put(STORE, record);
}

// =====================================
// Toggle Task
// =====================================

export async function toggleTask(memberId, taskId) {
  const record = await getTodayRecord(memberId);
  if (!record) return;

  const task = record.tasks.find(t => t.taskId === taskId);
  if (!task) return;

  if (task.status === "done") {
    task.status = "not_done";
    task.autoCompleted = false;
    task.completedAt = null;
  } else {
    task.status = "done";
    task.autoCompleted = false;
    task.completedAt = Date.now();
  }

  await save(record);
  return "task status updated";
}

// =====================================
// Mark Not Done
// =====================================

export async function markTaskNotDone(memberId, taskId) {
  const record = await getTodayRecord(memberId);
  if (!record) return;

  const task = record.tasks.find(t => t.taskId === taskId);
  if (!task) return;

  task.status = "not_done";
  task.autoCompleted = false;
  task.completedAt = null;

  await save(record);
}

// =====================================
// Auto Complete
// =====================================

export async function autoCompleteTask(memberId, taskId) {
  const record = await getTodayRecord(memberId);
  if (!record) return;

  const task = record.tasks.find(t => t.taskId === taskId);
  if (!task) return;

  if (task.status === "pending") {
    task.status = "done";
    task.autoCompleted = true;
    task.completedAt = Date.now();
  }

  await save(record);
}

// =====================================
// Get Task
// =====================================

export async function getTaskStatus(memberId, taskId) {
  const record = await getTodayRecord(memberId);
  if (!record) return null;
  return record.tasks.find(task => task.taskId === taskId);
}

// =====================================
// Reset Today
// =====================================

export async function resetToday(memberId) {
  const record = await getTodayRecord(memberId);
  if (!record) return;

  record.tasks.forEach(task => {
    task.status = "pending";
    task.autoCompleted = false;
    task.completedAt = null;
  });

  record.manualPoints = [];
  await save(record);
}

// =====================================
// Add Manual Points
// =====================================

export async function addManualPoint(memberId, points, reason) {
  const record = await getTodayRecord(memberId);
  if (!record) return;

  record.manualPoints.push({
    id: Date.now().toString(),
    type: "manual",
    points,
    reason,
    createdAt: Date.now(),
  });

  await save(record);
  return record;
}

// =====================================
// Get Member's Daily Records
// =====================================

export async function getMemberDailyRecords(memberId) {
  const db = await getDB();
  const tx = db.transaction(STORE);
  const index = tx.store.index("memberId");
  return index.getAll(memberId);
}