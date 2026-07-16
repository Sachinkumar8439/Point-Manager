import { getDB } from "./db";

const STORE = "taskTemplates";

/*
Task Model

{

id,

title,

icon,

points,

memberCategory,

isCommon,

memberId,

hasTimeRange,

startTime,

endTime,

isActive,

createdAt,

updatedAt

}

*/


// ============================
// Add Task
// ============================

export async function addTask(task){

    const db = await getDB();

    task.createdAt = Date.now();

    task.updatedAt = Date.now();

    task.isActive = true;
    task.id = `task_${Date.now()}`;

    await db.add("tasks",task);

    return task;

}


// ============================
// Update Task
// ============================

export async function updateTask(id,data){

    const db = await getDB();

    const task = await db.get(STORE,id);

    if(!task){

        throw new Error("Task not found");

    }

    const updated={

        ...task,

        ...data,

        updatedAt:Date.now()

    }

    await db.put(STORE,updated);

    return updated;

}


// ============================
// Get Task
// ============================

export async function getTask(id){

    const db = await getDB();

    return await db.get(STORE,id);

}


// ============================
// All Active Tasks
// ============================

export async function getAllTasks(){

    const db = await getDB();

    return await db.getAll("tasks");

}


// ============================
// Common Tasks
// ============================

export async function getCommonTasks(){

    const tasks=await getAllTasks();
    console.log(tasks)

    return tasks.filter(task=>
        task.isCommon===true

    );

}


// ============================
// Extra Tasks
// ============================

export async function getExtraTasks(memberId){

    const tasks=await getAllTasks();

    return tasks.filter(task=>

        task.memberId===memberId

        &&

        task.isCommon===false

    );

}


// ============================
// Child Tasks

// Common + Extra

// ============================

export async function getTasksForMember(member){

    const common=await getCommonTasks();
    console.log("common",common)

    const extra=await getExtraTasks(

        member.id

    );

    return [

        ...common,

        ...extra

    ];

}


// ============================
// Disable Task

// ============================

export async function disableTask(id){

    return updateTask(id,{

        isActive:false

    });

}


// ============================
// Enable Task

// ============================

export async function enableTask(id){

    return updateTask(id,{

        isActive:true

    });

}


// ============================
// Search

// ============================

export async function searchTasks(keyword){

    const tasks=await getAllTasks();

    keyword=keyword.toLowerCase();

    return tasks.filter(task=>

        task.title

        .toLowerCase()

        .includes(keyword)

    );

}


// ============================
// Duplicate Check

// ============================

export async function taskExists(title){

    const tasks=await getAllTasks();

    return tasks.some(task=>

        task.title

        .trim()

        .toLowerCase()

        ===

        title

        .trim()

        .toLowerCase()

    );

}


// ============================
// Clear

// Development Only

// ============================

export async function clearTasks(){

    const db=await getDB();

    await db.clear(STORE);

}