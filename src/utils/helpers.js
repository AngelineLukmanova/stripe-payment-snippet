async function fetchFromAPI(API, endpoint, opts) {
  console.log(API, endpoint);
  const { method, body } = { method: 'POST', body: null, ...opts };
  const res = await fetch(`${API}/${endpoint}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export default fetchFromAPI;
