
export async function ping(): Promise<any> {
  const res = await fetch("http://localhost:3000/ping");
  return res.json();
}

export async function getContestants(): Promise<{ contestants: string[] }> {
  const res = await fetch("http://localhost:3000/contestants");
  return res.json();
}
