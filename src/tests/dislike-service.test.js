/**
* @jest-environment node
*/
import {
    findAllTuitsDislikedByUser,
    findAllUsersThatDislikedTuit,
    userDislikesTuit
} from "../services/dislikes-service";

import {
    createTuit,
    deleteTuit, findTuitById,
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

describe('can dislike a tuit with REST API', () => {
    test("find All Tuits Disliked By User", async () => {
        expect(newTuit.stats.dislikes).toEqual(0);

        // user dislikes
        await userDislikesTuit(newUser._id, newTuit._id);
        newTuit = await findTuitById(newTuit._id);
        expect(newTuit.stats.dislikes).toEqual(1);

        const tuitsDislikedByUser = await findAllTuitsDislikedByUser(newUser._id);
        expect(1).toEqual(tuitsDislikedByUser.length);
        expect(newTuit.tuit).toEqual(testTuit.tuit);

        // undo dislike
        await userDislikesTuit(newUser._id, newTuit._id);
        newTuit = await findTuitById(newTuit._id);
        expect(newTuit.stats.dislikes).toEqual(0);
    });
});
