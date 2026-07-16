import { getDB } from "./db";

/*
=========================================
Member Object

{
    id,
    name,
    photo,
    age,
    gender,
    category,
    createdAt,
    updatedAt,
    isActive
}
=========================================
*/

const STORE = "members";

/* =========================================
   Add Member
========================================= */

export async function addMember(member) {

    const db = await getDB();

    const exist = await db.get(STORE , "hhhh");

    if (exist) {

        throw new Error("Member already exists.");

    }

    member.createdAt = Date.now();
    member.updatedAt = Date.now();
    member.isActive = true;
    member.id = `member_${member.createdAt}`

    await db.add(STORE, member);

    return member;

}

/* =========================================
   Update Member
========================================= */

export async function updateMember(id, data) {

    const db = await getDB();

    const member = await db.get(STORE, id);

    if (!member) {

        throw new Error("Member not found.");

    }

    const updatedMember = {

        ...member,

        ...data,

        updatedAt: Date.now()

    };

    await db.put(STORE, updatedMember);

    return updatedMember;

}

/* =========================================
   Save Photo
========================================= */

export async function updateMemberPhoto(id, photoBlob) {

    return updateMember(id, {

        photo: photoBlob

    });

}

/* =========================================
   Get Single Member
========================================= */

export async function getMember(id) {

    const db = await getDB();
    // console.log(id)

    return await db.get(STORE, id);

}

/* =========================================
   Get All Members
========================================= */

export async function getAllMembers() {

    const db = await getDB();

    return await db.getAll(STORE);

}

/* =========================================
   Get Active Members
========================================= */

export async function getActiveMembers() {

    const db = await getDB();

    return await db.getAllFromIndex(

        STORE,

        "isActive",

        true

    );

}

/* =========================================
   Get Members By Category

child

woman

man

========================================= */

export async function getMembersByCategory(category) {

    const db = await getDB();

    return await db.getAllFromIndex(

        STORE,

        "category",

        category

    );

}

/* =========================================
   Search Member

Case Insensitive

========================================= */

export async function searchMembers(keyword) {

    const members = await getAllMembers();

    const text = keyword.toLowerCase();

    return members.filter(member =>

        member.name

            .toLowerCase()

            .includes(text)

    );

}

/* =========================================
   Delete Member

Hard Delete

========================================= */

export async function deleteMember(id) {

    const db = await getDB();

    await db.delete(STORE, id);
    return "memeber deleted successfully";

}

/* =========================================
   Soft Delete

========================================= */

export async function deactivateMember(id) {

    return updateMember(id, {

        isActive: false

    });

}

/* =========================================
   Activate Member

========================================= */

export async function activateMember(id) {

    return updateMember(id, {

        isActive: true

    });

}

/* =========================================
   Count Members

========================================= */

export async function countMembers() {

    const db = await getDB();

    return await db.count(STORE);

}

/* =========================================
   Check Duplicate Name

========================================= */

export async function isNameExists(name) {

    const members = await getAllMembers();

    return members.some(member =>

        member.name

            .trim()

            .toLowerCase()

        ===

        name

            .trim()

            .toLowerCase()

    );

}

/* =========================================
   Get Children

========================================= */

export async function getChildren() {

    return getMembersByCategory("child");

}

/* =========================================
   Get Women

========================================= */

export async function getWomen() {

    return getMembersByCategory("woman");

}

/* =========================================
   Get Men

========================================= */

export async function getMen() {

    return getMembersByCategory("man");

}

/* =========================================
   Clear Members

Development Purpose

========================================= */

export async function clearMembers() {

    const db = await getDB();

    await db.clear(STORE);

}