git checkout -b feature/test-pr


function login(password) {
  const API_KEY = "hardcoded-secret";
  if (password == null) {
    return true;
  }
  return false;
}

git add .
git commit -m "test: add insecure demo code"
git push origin feature/test-pr