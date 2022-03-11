import {
  createTuit,
  deleteTuit,
  findTuitById,
  findAllTuits
} from "../services/tuits-service";

import {
  createUser,
  deleteUsersByUsername,
  findAllUsers,
  findUserById,
} from "../services/users-service";

describe('can create tuit with REST API', () => {
  // sample user
  const testUser = {
    username: "adam",
    password: "adam_123",
    email: "adam@gmail.com",
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
    username: "adam",
    password: "adam_123",
    email: "adam@gmail.com",
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
    username: "adam",
    password: "adam_123",
    email: "adam@gmail.com",
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

describe('can retrieve all tuits with REST API', () => {
  // sample tuits we'll insert to then retrieve
  const allTuits = [
    "TuitOne",
    "TuitTwo",
    "TuitThree"
  ];

  // // setup test before running test
  // beforeAll(() => {
  //   // remove any/all users to make sure we create it in the test
  //   return deleteUsersByUsername(testUser.username);
  // })

  // // clean up after test runs
  // afterAll(() => {
  //   // remove any data we created
  //   return deleteUsersByUsername(testUser.username);
  // })

  test("can retrieve all tuits with REST API", async () => {
    // retrieve all the tuits
    const tuits = await findAllTuits();

    // there should be a minimum number of tuits
    expect(tuits.length).toBeGreaterThanOrEqual(allTuits.length);



    const tuitsInsert = tuits.filter((tuit) =>
      allTuits.includes(tuit.tuit)
    );

    //get all ids of the sample tuits for deleting after test
    const ids = tuitsInsert.map((item) => item._id);

    // get the item matching those in the sample list
    tuitsInsert.forEach((tuit) => {
      const sample = allTuits.find(
        (sampleTuit) => sampleTuit === tuit.tuit
      );
      expect(sample).toEqual(tuit.tuit);
    });

    // delete all test sample after finishing the test
    ids.forEach(async (id) => {
      const status = await deleteTuit(id);
      expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
  });
});

