/**
* @jest-environment node
*/

import { act, create } from "react-test-renderer"
import Tuits from "../components/tuits/index";
import MyDislikes from "../components/profile/my-dislikes";

const testUser = {
    username: 'admin',
    password: 'admin123',
    email: 'admin@gmail.com'
};

const testTuits = [
    {
        tuit: "test1",
        postedBy: testUser,
        stats: { dislikes: 1 },
        _id: "123"
    },
    {
        tuit: "test2",
        postedBy: testUser,
        stats: { dislikes: 2 },
        _id: "321"
    }
];

test("Tuits component renders in the screen", () => {
    let tuitsRender
    act(() => {
        tuitsRender = create(
            <MyDislikes />
        )
    })
    const root = tuitsRender.root
    const tuitsComponent = root.findByType(Tuits)
    expect(tuitsComponent).toBeTruthy();
})
