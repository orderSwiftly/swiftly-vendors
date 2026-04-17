import axios from "axios";

interface ComplaintData {
  subject: string;
  content: string;
  attachments?: File[];
}

export async function CreateComplaint(data: ComplaintData) {
  try {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const rawToken = localStorage.getItem("token");

    if (!rawToken) throw new Error("No auth token found in localStorage");

    // Normalize token (remove accidental Bearer prefix)
    const token = rawToken.startsWith("Bearer ")
      ? rawToken.replace("Bearer ", "")
      : rawToken;

    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("content", data.content);

    if (data.attachments?.length) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axios.post(
      `${api_url}/api/v1/complaint/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating complaint:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error creating complaint:", error.message);
    } else {
      console.error("Error creating complaint:", error);
    }
    throw error;
  }
}