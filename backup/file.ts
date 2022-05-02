interface Data {
  data: string;
}

const getAll = (input: Data) => {};

const user = {
  getMe: (input: Data) => {
    const a = "soutete";
  },
};

class B {
  user = user;

  posts = {
    getAll,
  };
}

/**
 * Documentation for C
 */
class C {
  /**
   * constructor documentation
   * @param a my parameter documentation
   * @param b another parameter documentation
   */
  constructor(a: string, b: B) {}
}
