import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function processExam(content: string | { mimeType: string; data: string }) {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    Bạn là một chuyên gia giáo dục. Nhiệm vụ của bạn là đọc đề thi và xác định đáp án đúng.
    
    YÊU CẦU CỰC KỲ QUAN TRỌNG:
    1. GIỮ NGUYÊN 100% ĐỊNH DẠNG: Không được thay đổi bất kỳ dấu cách, dấu xuống dòng, hay ký tự nào từ văn bản gốc.
    2. KHÔNG ĐƯỢC TỰ Ý SỬA LỖI CHÍNH TẢ hay thêm bớt bất kỳ từ ngữ nào.
    3. CHỈ ĐƯỢC THÊM thẻ <correct>...</correct> bao quanh đáp án đúng nhất.
    4. Đáp án đúng thường là một cụm từ sau các chữ cái A, B, C, D hoặc là cả dòng chứa phương án đó.
    5. Trả về toàn bộ văn bản gốc đã được chèn thẻ <correct>.
    
    Ví dụ:
    Gốc: "Câu 1: 1+1=? \n A. 1  B. 2  C. 3"
    Kết quả: "Câu 1: 1+1=? \n A. 1  <correct>B. 2</correct>  C. 3"
  `;

  const prompt = typeof content === "string" 
    ? { role: "user", parts: [{ text: content }] }
    : { role: "user", parts: [{ inlineData: content }, { text: "Hãy đọc đề thi này và đánh dấu đáp án đúng." }] };

  const response = await ai.models.generateContent({
    model,
    contents: [prompt],
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  return response.text;
}
