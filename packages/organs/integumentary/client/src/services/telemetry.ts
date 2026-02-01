
export const getHealth = async () => {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to get health:", error);
    return { status: 'fail', error: (error as Error).message };
  }
};

export const pingNeon = async () => {
  try {
    const response = await fetch('/api/ping/neon');
     if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to ping Neon:", error);
    return { status: 'fail', error: (error as Error).message };
  }
};

export const pingUpstash = async () => {
  try {
    const response = await fetch('/api/ping/upstash');
     if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to ping Upstash:", error);
    return { status: 'fail', error: (error as Error).message };
  }
};
