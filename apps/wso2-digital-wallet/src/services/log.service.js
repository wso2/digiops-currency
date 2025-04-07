export const logService = async ({ type, message }) => {
  try {
    const response = await fetch("http://172.20.10.2:3001/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({type: type, message : message}),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  } catch (error) {
    console.error("Logging failed:", error);
    
  }
};
