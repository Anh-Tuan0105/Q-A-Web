/**
 * Danh sách từ cấm tiếng Việt (User sẽ tự thêm nội dung)
 */
const blacklist = [
// Chửi thề phổ biến (dạng viết tắt)
  "đm", "dm", "đmm", "dmm", "đmcs", "đmct",
  "clm", "cl",
  "đcm", "dcm",
  "cc", "ccc",
  "đkm", "dkm",
  "lol",
  "đbt", "dbt",
  "mđ", "md",
  "cmm", "cm",
  "đ m", "v c l", "c l m", 
 
  // Từ thô tục dạng đầy đủ (đã lược bớt để phù hợp)
  "đéo", "deo",
  "địt", "dit",
  "lồn", "lon",
  "cặc", "cac",
  "buồi", "buoi",
  "đụ", "du má",
  "con lồn",
  "đầu buồi",
  "cái lồn",
  "đít", "dit me",
  "cứt",
  "chó chết",
  "chết tiệt",
  "mả mẹ", "ma me",
  "mả cha", "ma cha",
  "thằng chó",
  "con chó",
  "thằng khốn",
  "con khốn",
  "đồ chó",
  "đồ khốn",
  "ngu vl", "ngu vcl",
  "óc chó",
 
  // Spam / vô nghĩa lặp lại
  "aaaaaaa",
  "asdasd",
  "qweqwe",
  "zxczxc",
  "123123",
  "test test test",

  // === TỪ KHÓ CHỊU / XÚC PHẠM NHẸ (MỚI THÊM - phù hợp trình bày) ===
  "ngu", "đồ ngu", "thằng ngu", "con ngu", "ngu si", "ngu như bò", "ngu vl",
  "điên", "thằng điên", "đồ điên", "khùng", "đồ khùng", "thần kinh",
  "hâm", "đồ hâm",
  "rác", "đồ rác", "rác rưởi",
  "vô dụng", "thằng vô dụng", "con vô dụng",
  "thất bại", "đồ thất bại",
  "óc chó", "não ngắn", "não lồn", "não bò",
  "dốt", "đồ dốt", "thằng dốt",
  "xấu tính", "đồ xấu tính",
  "giả tạo", "đồ giả tạo",
  "cặn bã", "đồ cặn bã",
  "mất dạy", "đồ mất dạy",
  "hèn", "đồ hèn", "hèn nhát",
  "đê tiện", "đồ đê tiện",

  // Các cụm hay gặp trên Stack Overflow kiểu VN
  "sao mày ngu thế", "mày điên à", "óc chó à", "não ngắn vl",
  "đồ rác", "câu hỏi vớ vẩn",
];

/**
 * Kiểm tra xem văn bản có chứa từ cấm không
 * @param {string} text 
 * @returns {string|null} Trả về từ bị cấm tìm thấy đầu tiên, hoặc null nếu sạch
 */
export const checkBlacklist = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  for (const word of blacklist) {
    if (lowerText.includes(word.toLowerCase())) {
      return word;
    }
  }
  return null;
};
