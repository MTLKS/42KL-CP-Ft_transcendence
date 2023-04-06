// assign is better than replace because it doesn't reset the history

function login() {
  window.location.assign(
    `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-4c29cbf4207361e7d7f64f8042b884befe572627f7e28b4b71838c2062bab937&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code`
  );
}

export default login;
