import {
  createTuit,
  deleteTuit,
  findTuitById,
  findAllTuits,
  findTuitByUser
} from "../services/tuits-service";

import {
  createUser,
  deleteUsersByUsername
} from "../services/users-service";

describe('can create tuit with REST API', () => {
  // sample user
  const testUser = {
    username: "admin",
    password: "admin_123",
    email: "admin@gmail.com",
  };

  // sample tuit to insert
  const createTuits = {
    tuit: 'This is the test tuit to be created!'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(testUser.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(testUser.username);
  })

  test('can insert new tuits with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(testUser);
    // verify new user matches the parameter user
    expect(newUser.username).toEqual(testUser.username);
    expect(newUser.password).toEqual(testUser.password);
    expect(newUser.email).toEqual(testUser.email);

    // insert new tuit in the database
    const newTuit = await createTuit(newUser._id, createTuits);
    // verify inserted tuit's properties match parameter tuit
    expect(newTuit.postedBy).toEqual(newUser._id);
    expect(newTuit.tuit).toEqual(createTuits.tuit);

    // delete tuit
    const status = await deleteTuit(newTuit._id);
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can delete tuit wtih REST API', () => {
  // sample user
  const testUser = {
    username: "admin",
    password: "admin_123",
    email: "admin@gmail.com",
  };

  // sample tuit to delete
  const deleteTuits = {
    tuit: 'This is the test tuit to be deleted!'
  }

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(testUser.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(testUser.username);
  })

  test('can delete tuits from REST API by user id', async () => {
    // insert new user in the database
    const newUser = await createUser(testUser);
    // verify new user matches the parameter user
    expect(newUser.username).toEqual(testUser.username);
    expect(newUser.password).toEqual(testUser.password);
    expect(newUser.email).toEqual(testUser.email);

    // insert new tuit in the database
    const newTuit = await createTuit(newUser._id, deleteTuits);
    // verify inserted tuit's properties match parameter tuit
    expect(newTuit.postedBy).toEqual(newUser._id);
    expect(newTuit.tuit).toEqual(deleteTuits.tuit);

    // delete a tuit by their tuit id. Assumes tuit already exists
    const status = await deleteTuit(newTuit._id);
    // verify we deleted at least one user by their id
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  // sample user
  const testUser = {
    username: "admin",
    password: "admin_123",
    email: "admin@gmail.com",
  };

  // sample tuit to insert
  const RetrieveTuit = {
    tuit: 'This is the test tuit to be retrieved by PK!'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(testUser.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(testUser.username);
  })

  test('an retrieve a tuit by their primary key with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(testUser);
    // verify new user matches the parameter user
    expect(newUser.username).toEqual(testUser.username);
    expect(newUser.password).toEqual(testUser.password);
    expect(newUser.email).toEqual(testUser.email);

    // insert the tuit in the database
    const newTuit = await createTuit(newUser._id, RetrieveTuit);

    // verify new tuit matches the parameter tuit
    expect(newTuit.tuit).toEqual(RetrieveTuit.tuit);

    // retrieve the tuit from the database by its primary key
    const existingTuit = await findTuitById(newTuit._id);
    const newTuitId = newTuit._id;

    // verify retrieved tuit matches parameter tuit
    expect(existingTuit.tuit).toEqual(RetrieveTuit.tuit);
    expect(newTuitId).toEqual(existingTuit._id);

    // delete a tuit by their tuit id. Assumes tuit already exists
    const status = await deleteTuit(newTuit._id);
    // verify we deleted at least one user by their id
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

let testUser = {
  username: "admin",
  password: "admin_123",
  email: "admin@gmail.com",
};

beforeAll(async () => {
  testUser = await createUser(testUser);
})

afterAll(() => {
  return deleteUsersByUsername(testUser.username);
})

describe('can retrieve all tuits with REST API', () => {
  // sample tuits we'll insert to then retrieve
  let testTuits = [
    "All", "Test", "Tuits"
  ];

  beforeAll(() => {
    return Promise.all(
      testTuits.map(
        tuit => createTuit(testUser._id, { tuit: tuit })
      )
    );
  });

  afterAll(async () => {
    const insertedTuits = await findTuitByUser(testUser._id);
    return Promise.all(
      insertedTuits.map(
        tuit => deleteTuit(tuit._id)
      )
    );
  });

  test("can retrieve all tuits with REST API", async () => {
    // retrieve all the tuits
    const allTuits = await findAllTuits();

    // there should be a minimum number of tuits
    expect(allTuits.length).toBeGreaterThanOrEqual(testTuits.length);

    // let's check each user we inserted
    const insertedTuits = allTuits.filter(
      tuit => testTuits.indexOf(tuit.tuit) >= 0);

    // compare the actual users in database with the ones we sent
    testTuits.forEach(tuitContent => {
      const insertedOne = insertedTuits.find(tuit => tuit.tuit === tuitContent);
    })
  })
});