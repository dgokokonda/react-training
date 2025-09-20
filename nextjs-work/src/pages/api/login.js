// type loginType = {
//   email: string,
//   password: string
// }

export const fakeLogin = ({ email, password, username } /*: loginType*/) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (email && password && username) {
        resolve({ email, password, username });
      } else reject({ message: "Invalid email or password or username" });
    }, 1000)
  );
