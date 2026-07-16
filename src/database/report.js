// report.js
import { getDB } from "./db";
import { STORES } from "./dbConstants";

const STORE = "reports";

/* =====================================================
   Helpers
===================================================== */

export function getYearMonth(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return {
    year,
    month,
    yearMonth: `${year}-${String(month).padStart(2, "0")}`,
  };
}

export function createReportId(memberId, yearMonth) {
  return `report_${memberId}_${yearMonth}`;
}

export function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

/* =====================================================
   Core Report Functions
===================================================== */

async function saveReport(report) {
  const db = await getDB();
  report.updatedAt = Date.now();
  await db.put(STORE, report);
  return report;
}

export async function getReport(id) {
  const db = await getDB();
  return db.get(STORE, id);
}

export async function getCurrentMonthReport(memberId) {
  const db = await getDB();
  const { yearMonth } = getYearMonth();
  console.log("Getting current month report for memberId:", memberId, "yearMonth:", yearMonth);
  return db.get(STORE, createReportId(memberId, yearMonth));
}

export async function getReportByMemberAndMonth(memberId, yearMonth) {
  const db = await getDB();
  return db.get(STORE, createReportId(memberId, yearMonth));
}

/* =====================================================
   Create/Update Report
===================================================== */

export async function createOrUpdateReport({
  memberId,
  monthPoints = 0,
  totalPoints = 0,
  completedTasks = 0,
  extraTasks = 0,
  isClosed = false,
  lastSyncedDate = null,
}) {
  const db = await getDB();
  const { year, month, yearMonth } = getYearMonth();
  const id = createReportId(memberId, yearMonth);

  const existing = await db.get(STORE, id);

  const report = {
    id,
    memberId,
    year,
    month,
    yearMonth,
    monthPoints,
    totalPoints,
    completedTasks,
    extraTasks,
    isClosed,
    lastSyncedDate,
    isReviewed: existing?.isReviewed ?? false,
    reviewedAt: existing?.reviewedAt ?? null,
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };

  await db.put(STORE, report);
  return report;
}

/* =====================================================
   Month Management (Private)
===================================================== */

async function closePreviousMonthReport(memberId) {
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const { yearMonth } = getYearMonth(prevDate);
  
  const prevReport = await getReportByMemberAndMonth(memberId, yearMonth);
  
  if (prevReport && !prevReport.isClosed) {
    prevReport.isClosed = true;
    prevReport.updatedAt = Date.now();
    await saveReport(prevReport);
    return prevReport;
  }
  return prevReport;
}

async function createCurrentMonthReportIfNotExists(memberId, totalPoints = 0) {
  const currentReport = await getCurrentMonthReport(memberId);
  
  if (!currentReport) {
    return await createOrUpdateReport({
      memberId,
      totalPoints,
      monthPoints: 0,
      isClosed: false,
      lastSyncedDate: null,
    });
  }
  
  return currentReport;
}

async function calculateYesterdayPoints(memberId) {
  const yesterdayDate = getYesterdayDate();
  const db = await getDB();
  
  // Get yesterday's daily record
  const recordId = `${memberId}_${yesterdayDate}`;
  const record = await db.get(STORES.DAILY_RECORDS, recordId);
  
  if (!record) return 0;
  
  // Calculate points from completed tasks
  let points = 0;
  
  // Tasks points
  record.tasks?.forEach(task => {
    if (task.status === "done") {
      points += task.points || 0;
    }
  });
  
  // Manual points
  record.manualPoints?.forEach(point => {
    points += point.points || 0;
  });
  
  return points;
}

async function updateCurrentMonthPoints(memberId, yesterdayPoints) {
  const currentReport = await getCurrentMonthReport(memberId);
  
  if (!currentReport) return null;
  
  // Don't update if already synced for today
  const today = getTodayDate();
  if (currentReport.lastSyncedDate === today) {
    return currentReport;
  }
  
  currentReport.monthPoints += yesterdayPoints;
  currentReport.totalPoints += yesterdayPoints;
  currentReport.lastSyncedDate = today;
  currentReport.updatedAt = Date.now();
  
  await saveReport(currentReport);
  return currentReport;
}

/* =====================================================
   Public API - Main Function
===================================================== */

export async function syncMonthlyReport(member) {
  if (!member || !member.id) {
    throw new Error("Invalid member object");
  }
  
  const memberId = member.id;
  
  // Step 1: Close previous month if needed
  await closePreviousMonthReport(memberId);
  
  // Step 2: Get current month report or create it
  let currentReport = await getCurrentMonthReport(memberId);
  
  if (!currentReport) {
    // Get total points from previous closed report
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const { yearMonth } = getYearMonth(prevDate);
    const prevReport = await getReportByMemberAndMonth(memberId, yearMonth);
    
    currentReport = await createCurrentMonthReportIfNotExists(
      memberId, 
      prevReport?.totalPoints || 0
    );
  }
  
  // Step 3: Calculate yesterday's points
  const yesterdayPoints = await calculateYesterdayPoints(memberId);
  
  // Step 4: Update current month with yesterday's points
  if (yesterdayPoints > 0) {
    await updateCurrentMonthPoints(memberId, yesterdayPoints);
  }
  
  // Step 5: Get updated report
  const updatedReport = await getCurrentMonthReport(memberId);
  
  return updatedReport;
}

/* =====================================================
   Other Report Functions
===================================================== */

export async function getMemberReports(memberId) {
  const db = await getDB();
  const tx = db.transaction(STORE);
  const index = tx.store.index("memberId");
  return index.getAll(memberId);
}

export async function getReportsByMonth(yearMonth) {
  const db = await getDB();
  const tx = db.transaction(STORE);
  const index = tx.store.index("yearMonth");
  return index.getAll(yearMonth);
}

export async function markReportReviewed(id) {
  const db = await getDB();
  const report = await db.get(STORE, id);
  if (!report) return null;
  
  report.isReviewed = true;
  report.reviewedAt = Date.now();
  report.updatedAt = Date.now();
  await db.put(STORE, report);
  return report;
}

export async function deleteReport(id) {
  const db = await getDB();
  await db.delete(STORE, id);
  return true;
}

export async function getClosedReports(memberId) {
  const db = await getDB();
  const allReports = await getMemberReports(memberId);
  return allReports.filter(report => report.isClosed === true);
}