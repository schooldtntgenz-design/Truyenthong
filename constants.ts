import { AppData, Subject, Question } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'poster',
    name: 'Thiết kế Poster',
    icon: 'Palette',
    questionsCount: 5,
    description: 'Học cách phối màu, bố cục và font chữ cho poster truyền thông.'
  },
  {
    id: 'video',
    name: 'Kịch bản Video',
    icon: 'Video',
    questionsCount: 5,
    description: 'Quy trình tạo kịch bản triệu view trên các nền tảng mạng xã hội.'
  },
  {
    id: 'infographic',
    name: 'Đồ họa Thông tin',
    icon: 'BarChart3',
    questionsCount: 5,
    description: 'Chuyển đổi dữ liệu phức tạp thành hình ảnh dễ hiểu.'
  },
  {
    id: 'viral',
    name: 'Marketing Lan truyền',
    icon: 'Zap',
    questionsCount: 5,
    description: 'Các nguyên lý tâm lý học để nội dung của bạn được chia sẻ rộng rãi.'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Poster Design
  {
    id: 'p1',
    subjectId: 'poster',
    content: 'Tỷ lệ vàng trong thiết kế Poster thường giúp ích gì?',
    type: 'single-choice',
    options: [
      'Làm poster trông đắt tiền hơn',
      'Tạo sự cân bằng tự nhiên và dẫn dắt mắt người xem',
      'Giúp tiết kiệm màu mực khi in',
      'Làm cho poster nhỏ hơn'
    ],
    correctAnswer: 1,
    explanation: 'Tỷ lệ vàng (Golden Ratio) giúp tạo ra bố cục hài hòa, dễ nhìn và dẫn dắt hướng nhìn của người xem một cách tự nhiên nhất.',
    difficulty: 'easy'
  },
  {
    id: 'p2',
    subjectId: 'poster',
    content: 'Luật 1/3 (Rule of Thirds) thường đặt đối tượng quan trọng ở đâu?',
    type: 'single-choice',
    options: [
      'Chính giữa poster',
      'Ở 4 góc ngoài cùng',
      'Tại các điểm giao nhau của lưới 3x3',
      'Ở dưới cùng của poster'
    ],
    correctAnswer: 2,
    explanation: 'Luật 1/3 khuyến khích đặt chủ thể tại các điểm giao nhau để tạo sự năng động và trừu tượng cho bố cục.',
    difficulty: 'medium'
  },
  // Video Script
  {
    id: 'v1',
    subjectId: 'video',
    content: '3 giây đầu tiên của một video ngắn (Short/TikTok) được gọi là gì?',
    type: 'single-choice',
    options: [
      'Intro long lanh',
      'Hook (Cú móc/Mồi nhử)',
      'Logo animation',
      'Credit nhà sản xuất'
    ],
    correctAnswer: 1,
    explanation: 'Hook là yếu tố cực kỳ quan trọng để giữ chân người xem không lướt qua video của bạn trong 3 giây đầu.',
    difficulty: 'easy'
  },
  {
    id: 'v2',
    subjectId: 'video',
    content: 'Cấu trúc kịch bản "Vấn đề - Giải pháp - Kết quả" phù hợp với loại video nào nhất?',
    type: 'single-choice',
    options: [
      'Video hát nhép (Lipsync)',
      'Video review sản phẩm hoặc hướng dẫn',
      'Video phong cảnh',
      'Video nhảy cover'
    ],
    correctAnswer: 1,
    explanation: 'Đây là cấu trúc kể chuyện kinh điển giúp người xem nhận ra giá trị của giải pháp mà bạn đưa ra.',
    difficulty: 'medium'
  }
];

export const MOCK_HISTORY = [
  {
    id: 's1',
    subjectId: 'poster',
    score: 80,
    totalQuestions: 5,
    correctAnswers: 4,
    timeSpent: 120,
    date: '2026-04-20T10:00:00Z'
  },
  {
    id: 's2',
    subjectId: 'video',
    score: 100,
    totalQuestions: 5,
    correctAnswers: 5,
    timeSpent: 90,
    date: '2026-04-22T15:30:00Z'
  }
];
