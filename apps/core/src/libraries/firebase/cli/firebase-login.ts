import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Get an existing user form Firebase e register on our system.
 */
(async () => {
  const args = process.argv.slice(2);
  let doSignup = false;

  if (!process.env.FIREBASE_DEV_WEB_APP_CONFIG) {
    console.log(
      'ERROR! FIREBASE_DEV_WEB_APP_CONFIG not set, you can take it from Firebase Apps Settings',
    );
    return;
  }

  const email = args[0];
  const password = args[1];
  if (args[0] == '-s') {
    doSignup = true;
  }
  if (!email || !password) {
    console.log('ERROR! Email or password not provided');
    console.log('Arguments: <email> <password>');
    return;
  }

  const webConfigJson =
    '{\n' +
    process.env.FIREBASE_DEV_WEB_APP_CONFIG.replaceAll(
      /^\s+(\w+): '(.+)',$/gm,
      '"$1": "$2"',
    )
      .split('\n')
      .slice(1, -1)
      .join(',\n') +
    '\n}';

  const webConfig = JSON.parse(webConfigJson);
  const webApp = initializeApp(webConfig);
  const auth = getAuth(webApp);
  let credentials;
  if (doSignup) {
    credentials = await createUserWithEmailAndPassword(auth, email, password);
  } else {
    credentials = await signInWithEmailAndPassword(auth, email, password);
  }

  const idToken = await credentials.user.getIdToken(true);
  console.log(idToken);
})();
