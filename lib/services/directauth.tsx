export async function login(url: string, username: string, password: string) {
  const payload = { username, password };

  let options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${url}/auth/login/`, options);
  if (response && response.ok) {
    const json = await response.json();
    return json?.token;
  } else {
    let msg = `Please try again ${response.status}`;
    if (response.status >= 400 && response.status <= 499) {
      msg = `Invalid credentials ${response.status}`;
    } else if (response.status >= 500 && response.status <= 599) {
      msg = `System is under maintenance ${response.status} - Try later`;
    }
    throw Error(`Login failed\n${msg}`);
  }
}
