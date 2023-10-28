export async function getUserAccessTokenData(
  userId: string,
  setToken: Function,
  setTokenSecret: Function
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}api/accesstoken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    setToken(data?.token);
    setTokenSecret(data?.tokenSecret);
  } catch (error) {
    console.error(error);
  }
}
