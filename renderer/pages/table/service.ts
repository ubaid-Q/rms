export async function getTables({
  baseUrl,
  setLoading,
  setTables,
}: {
  baseUrl: string;
  setLoading: Function;
  setTables: Function;
}) {
  const response = await fetch(`http://${baseUrl}:5000/api/tables`, {
    method: "GET",
  });
  const data = await response.json();
  setTables(data.data);
  setLoading(false);
}
