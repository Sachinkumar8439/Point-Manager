import { getDB } from "./db";

const STORE = "pointTransactions";

function today() {
  return new Date().toISOString().split("T")[0];
}

// =====================================
// Add Transaction
// =====================================

export async function addPointTransaction(data) {

  const db = await getDB();

  const transaction = {
    id: crypto.randomUUID(),

    memberId: data.memberId,

    date: data.date || today(),

    type: data.type, // add | deduct

    points: Number(data.points),

    reason: data.reason || "",

    createdAt: Date.now(),
  };

  await db.add(STORE, transaction);

  return transaction;
}

// =====================================
// Add Point
// =====================================

export async function addPoint(memberId, points, reason = "") {

  return addPointTransaction({

    memberId,

    points,

    reason,

    type: "add",
  });

}

// =====================================
// Deduct Point
// =====================================

export async function deductPoint(memberId, points, reason = "") {

  return addPointTransaction({

    memberId,

    points,

    reason,

    type: "deduct",
  });

}

// =====================================
// Get Single Transaction
// =====================================

export async function getPointTransaction(id) {

  const db = await getDB();

  return await db.get(STORE, id);

}

// =====================================
// Get Member Transactions
// =====================================

export async function getMemberTransactions(memberId) {

  const db = await getDB();

  return await db.getAllFromIndex(
    STORE,
    "memberId",
    memberId
  );

}

// =====================================
// Get Today's Transactions
// =====================================

export async function getTodayTransactions(memberId) {

  const list = await getMemberTransactions(memberId);

  return list.filter(item => item.date === today());

}

// =====================================
// Delete Transaction
// =====================================

export async function deletePointTransaction(id) {

  const db = await getDB();

  await db.delete(STORE, id);

}

// =====================================
// Update Transaction
// =====================================

export async function updatePointTransaction(id, data) {

  const db = await getDB();

  const transaction = await db.get(STORE, id);

  if (!transaction) {

    throw new Error("Transaction not found");

  }

  const updated = {

    ...transaction,

    ...data,

  };

  await db.put(STORE, updated);

  return updated;

}

// =====================================
// Get Total Manual Points
// =====================================

export async function getManualPointTotal(memberId) {

  const list = await getMemberTransactions(memberId);

  let total = 0;

  for (const item of list) {

    if (item.type === "add") {

      total += item.points;

    } else {

      total -= item.points;

    }

  }

  return total;

}

// =====================================
// Clear All
// =====================================

export async function clearPointTransactions() {

  const db = await getDB();

  await db.clear(STORE);

}