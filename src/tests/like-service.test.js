/**
* @jest-environment node
*/
import {
    findAllTuitsLikedByUser,
    findAllUsersThatLikedTuit,
    userLikesTuit,
} from "../services/likes-service";

import {
    createTuit,
    deleteTuit,
    findTuitById,
    findAllTuits
} from "../services/tuits-service";

import {
    createUser,
    deleteUsersByUsername
} from "../services/users-service";

const testUser = {
    username: 'admin',
    password: 'admin123',
    email: 'admin@gmail.com'
};
const testTuit = {
    tuit: 'This is a test Tuit.',
}

let newUser;
let newTuit;
let uid;
let tid;

// setup test before running test
beforeAll(async () => {
    // remove any/all users to make sure we create it in the test
    await deleteUsersByUsername(testUser.username);
    // insert new user in the database
    newUser = await createUser(testUser);
    uid = newUser._id
    // insert new tuit in the database
    newTuit = await createTuit(uid, testTuit);
    tid = newTuit._id;
})

// clean up after test runs
afterAll(async () => {
    // remove user 
    await deleteUsersByUsername(testUser.username);
    // remove tuit 
    await deleteTuit(tid);
});

describe('can like a tuit with REST API', () => {
    test("find All Tuits Liked By User", async () => {
        expect(newTuit.stats.likes).toEqual(0);

        // user likes
        await userLikesTuit(newUser._id, newTuit._id);
        newTuit = await findTuitById(newTuit._id);
        expect(newTuit.stats.likes).toEqual(1);

        const tuitsLikedByUser = await findAllTuitsLikedByUser(newUser._id);
        expect(1).toEqual(tuitsLikedByUser.length);
        expect(newTuit.tuit).toEqual(testTuit.tuit);

        // undo like
        await userLikesTuit(newUser._id, newTuit._id);
        newTuit = await findTuitById(newTuit._id);
        expect(newTuit.stats.likes).toEqual(0);
    });
});
