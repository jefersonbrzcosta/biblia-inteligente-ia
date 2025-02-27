export const fetchAnswer = async (question: string) => {
  const response = await fetch("http://localhost:3001/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
  return response.json();
};
