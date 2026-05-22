export interface Question {
  id: number;
  sectionId: 'section1' | 'section2' | 'section3' | 'section4';
  sectionTitle: string;
  questionText: string;
  options: string[]; // Options will be text with math
  correctIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string; // Step-by-step explanation using KaTeX
}

export const SECTIONS = [
  { id: 'section1', title: 'Phần 1: Thống kê và Độ lệch chuẩn', range: 'Câu 1 - 5' },
  { id: 'section2', title: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)', range: 'Câu 6 - 10' },
  { id: 'section3', title: 'Phần 3: Hình học không gian Oxyz', range: 'Câu 11 - 22' },
  { id: 'section4', title: 'Phần 4: Cấp số cộng và Cấp số nhân', range: 'Câu 23 - 30' }
] as const;

export const QUESTIONS: Question[] = [
  // --- PHẦN 1: THỐNG KÊ VÀ ĐỘ LỆCH CHUẨN ---
  {
    id: 1,
    sectionId: 'section1',
    sectionTitle: 'Phần 1: Thống kê và Độ lệch chuẩn',
    questionText: 'Cho mẫu số liệu sau: $5, 7, 8, 10, 15$. Hãy tính số trung bình (giá trị trung bình) của mẫu số liệu này.',
    options: ['9', '8', '10', '45'],
    correctIndex: 0,
    explanation: 'Số trung bình (giá trị trung bình) của mẫu số liệu được tính bằng công thức:\n\n$$\\bar{x} = \\frac{5 + 7 + 8 + 10 + 15}{5} = \\frac{45}{5} = 9$$\n\nDo đó, giá trị trung bình là **9**.'
  },
  {
    id: 2,
    sectionId: 'section1',
    sectionTitle: 'Phần 1: Thống kê và Độ lệch chuẩn',
    questionText: 'Một mẫu số liệu thống kê có phương sai bằng $s^2 = 16$. Hãy xác định độ lệch chuẩn $s$ của mẫu số liệu đó.',
    options: ['4', '256', '8', '-4'],
    correctIndex: 0,
    explanation: 'Độ lệch chuẩn $s$ là căn bậc hai số học của phương sai $s^2$:\n\n$$s = \\sqrt{s^2} = \\sqrt{16} = 4$$\n\n*Lưu ý:* Độ lệch chuẩn luôn là một đại lượng không âm ($s \\ge 0$).'
  },
  {
    id: 3,
    sectionId: 'section1',
    sectionTitle: 'Phần 1: Thống kê và Độ lệch chuẩn',
    questionText: 'Cho một mẫu số liệu có các giá trị là $2, 4, 6, 8$. Hãy tính phương sai ($s^2$) của mẫu số liệu này.',
    options: ['5', '2', '4', '2.5'],
    correctIndex: 0,
    explanation: 'Ta thực hiện tính phương sai theo các bước sau:\n\n1. Tính số trung bình cộng của mẫu số liệu:\n$$\\bar{x} = \\frac{2 + 4 + 6 + 8}{4} = \\frac{20}{4} = 5$$\n\n2. Tính phương sai $s^2$ theo công thức:\n$$s^2 = \\frac{(2-5)^2 + (4-5)^2 + (6-5)^2 + (8-5)^2}{4}$$\n$$s^2 = \\frac{(-3)^2 + (-1)^2 + 1^2 + 3^2}{4} = \\frac{9 + 1 + 1 + 9}{4} = \\frac{20}{4} = 5$$\n\nVậy phương sai của mẫu số liệu này bằng **5**.'
  },
  {
    id: 4,
    sectionId: 'section1',
    sectionTitle: 'Phần 1: Thống kê và Độ lệch chuẩn',
    questionText: 'Một mẫu số liệu khảo sát thời gian tự học của học sinh có kết quả giá trị trung bình là 6. Phương sai đo được là $s^2 = 0.25$. Hãy tính độ lệch chuẩn của mẫu số liệu này.',
    options: ['0.5', '0.0625', '2.45', '0.125'],
    correctIndex: 0,
    explanation: 'Độ lệch chuẩn $s$ là căn bậc hai số học của phương sai $s^2$:\n\n$$s = \\sqrt{s^2} = \\sqrt{0.25} = 0.5$$\n\nDo đó, độ lệch chuẩn đo được là **0.5** giờ (hoặc đơn vị thời gian tương ứng).'
  },
  {
    id: 5,
    sectionId: 'section1',
    sectionTitle: 'Phần 1: Thống kê và Độ lệch chuẩn',
    questionText: 'Tính giá trị trung bình cộng của mẫu điểm số gồm các phần tử: $4, 6, 6, 7, 7, 7, 8, 9$.',
    options: ['6.75', '7', '6.5', '7.25'],
    correctIndex: 0,
    explanation: 'Mẫu số liệu có tổng cộng $N = 8$ phần tử.\n\nTrung bình cộng được tính như sau:\n$$\\bar{x} = \\frac{4 + 6 + 6 + 7 + 7 + 7 + 8 + 9}{8} = \\frac{54}{8} = 6.75$$'
  },

  // --- PHẦN 2: TÍCH PHÂN CƠ BẢN (BẤM MÁY CASIO) ---
  {
    id: 6,
    sectionId: 'section2',
    sectionTitle: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)',
    questionText: 'Tính giá trị của tích phân sau: $I = \\int_{0}^{2} (3x^2 + 1) dx$.',
    options: ['10', '8', '12', '6'],
    correctIndex: 0,
    explanation: 'Ta có thể tính tích phân này bằng tự luận hoặc bằng máy tính Casio:\n\n**Phương pháp tự luận:**\n$$I = \\int_{0}^{2} (3x^2 + 1) dx = \\left[ x^3 + x \\right]\\Big|_{0}^{2}$$\n$$I = (2^3 + 2) - (0^3 + 0) = (8 + 2) - 0 = 10$$\n\n**Phương pháp bấm máy Casio:**\n1. Nhấn nút tích phân $\\int_{\\Box}^{\\Box} \\Box$\n2. Nhập biểu thức: `3X^2 + 1`\n3. Nhập cận dưới `0` và cận trên `2`\n4. Nhấn nút `=` ta thu được kết quả trực tiếp là **10**.'
  },
  {
    id: 7,
    sectionId: 'section2',
    sectionTitle: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)',
    questionText: 'Tính giá trị tích phân sau: $I = \\int_{1}^{e} \\frac{1}{x} dx$.',
    options: ['1', '0', '$e$', '2.718'],
    correctIndex: 0,
    explanation: '**Phương pháp tự luận:**\nTa biết nguyên hàm của $\\frac{1}{x}$ là $\\ln|x|$:\n$$I = \\int_{1}^{e} \\frac{1}{x} dx = \\ln|x|\\Big|_{1}^{e} = \\ln(e) - \\ln(1) = 1 - 0 = 1$$\n\n**Phương pháp bấm máy Casio:**\n1. Nhập phím tích phân.\n2. Nhập phân số `1/X`.\n3. Nhập cận dưới từ `1` đến cận trên là hằng số `e` (nhấn `ALPHA` + `x10^x` hoặc `SHIFT` + `ln` để gõ chữ $e$).\n4. Nhấn phím `=` thu được kết quả trực tiếp bằng **1**.'
  },
  {
    id: 8,
    sectionId: 'section2',
    sectionTitle: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)',
    questionText: 'Tính giá trị tích phân sau (Lưu ý chuyển máy tính sang chế độ Radian): $I = \\int_{0}^{\\pi/2} \\sin(x) dx$.',
    options: ['1', '0', '-1', '$\\frac{\\pi}{2}$'],
    correctIndex: 0,
    explanation: '**Lưu ý cực kỳ quan trọng:** Phải chuyển đơn vị đo góc của máy tính Casio sang **Radian** (nhấn `SHIFT` -> `MENU` -> `2` -> `2` trên dòng Casio 580VNX) trước khi tính toán lượng giác.\n\n**Phương pháp tự luận:**\n$$I = \\int_{0}^{\\pi/2} \\sin(x) dx = \\left[ -\\cos(x) \\right]\\Big|_{0}^{\\pi/2}$$\n$$I = -\\cos\\left(\\frac{\\pi}{2}\\right) - (-\\cos(0)) = -0 + 1 = 1$$\n\n**Phương pháp bấm máy Casio:**\n1. Chuyển chế độ sang Radian (màn hình hiển thị chữ **R**).\n2. Nhập biểu thức tích phân: cận dưới `0`, cận trên `pi/2`, hàm số `sin(X)`.\n3. Ấn phím `=` và ra kết quả là **1**.'
  },
  {
    id: 9,
    sectionId: 'section2',
    sectionTitle: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)',
    questionText: 'Tính giá trị tích phân sau: $I = \\int_{1}^{2} (x^3 - 2x) dx$.',
    options: ['0.75', '1.25', '0.5', '2'],
    correctIndex: 0,
    explanation: '**Phương pháp tự luận:**\n$$I = \\int_{1}^{2} (x^3 - 2x) dx = \\left[ \\frac{x^4}{4} - x^2 \\right]\\Big|_{1}^{2}$$\n$$I = \\left( \\frac{2^4}{4} - 2^2 \\right) - \\left( \\frac{1^4}{4} - 1^2 \\right)$$\n$$I = (4 - 4) - \\left( 0.25 - 1 \\right) = 0 - (-0.75) = 0.75$$\n\n**Phương pháp bấm máy Casio:**\nNhập trực tiếp tích phân của hàm số `X^3 - 2X` đi từ `1` đến `2` trên máy tính rồi ấn `=`, kết quả hiển thị dạng phân số `3/4` hay dạng thập phân là **0.75**.'
  },
  {
    id: 10,
    sectionId: 'section2',
    sectionTitle: 'Phần 2: Tích phân cơ bản (Bấm máy Casio)',
    questionText: 'Tính giá trị của tích phân: $I = \\int_{0}^{1} e^x dx$.',
    options: ['$e - 1$', '$e$', '1', '$e + 1$'],
    correctIndex: 0,
    explanation: '**Phương pháp tự luận:**\nNguyên hàm của $e^x$ chính là $e^x$:\n$$I = \\int_{0}^{1} e^x dx = e^x\\Big|_{0}^{1} = e^1 - e^0 = e - 1$$\n\n**Phương pháp bấm máy Casio:**\n1. Nhập tích phân biểu thức `e^X` chạy từ `0` đến `1`.\n2. Bấm `=` màn hình hiển thị số hữu tỷ sấp sỉ: $1.718281828...$\n3. Thử từng phương án đáp án bằng cách bấm trừ đi giá trị sấp sỉ vừa tính:\n   - Phương án A: $e - 1 \\approx 2.71828 - 1 = 1.71828$ (Trùng khớp hoàn toàn).\nDo đó đáp án chính xác là **e - 1**.'
  },

  // --- PHẦN 3: HÌNH HỌC KHÔNG GIAN OXYZ ---
  {
    id: 11,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{u} = (1; 2; 3)$ và $\\vec{v} = (2; -1; 4)$. Tính tích vô hướng $\\vec{u} \\cdot \\vec{v}$.',
    options: ['12', '14', '10', '$(2; -2; 12)$'],
    correctIndex: 0,
    explanation: 'Tích vô hướng của hai vectơ $\\vec{u}(x_1; y_1; z_1)$ và $\\vec{v}(x_2; y_2; z_2)$ được xác định theo công thức:\n\n$$\\vec{u} \\cdot \\vec{v} = x_1 \\cdot x_2 + y_1 \\cdot y_2 + z_1 \\cdot z_2$$\n\nÁp dụng số liệu:\n$$\\vec{u} \\cdot \\vec{v} = 1 \\cdot 2 + 2 \\cdot (-1) + 3 \\cdot 4 = 2 - 2 + 12 = 12$$'
  },
  {
    id: 12,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{a} = (1; 0; 2)$ và $\\vec{b} = (2; 1; -1)$. Tìm tọa độ của vectơ tích có hướng $[\\vec{a}, \\vec{b}]$.',
    options: ['$(-2; 5; 1)$', '$(2; 3; 1)$', '$(-2; 3; -1)$', '$(0; 5; 1)$'],
    correctIndex: 0,
    explanation: 'Tích có hướng của hai vectơ $[\\vec{a}, \\vec{b}] = (x_c; y_c; z_c)$ được xác định theo định thức:\n\n$$x_c = \\begin{vmatrix} y_a & z_a \\\\ y_b & z_b \\end{vmatrix} = 0 \\cdot (-1) - 2 \\cdot 1 = -2$$\n$$y_c = \\begin{vmatrix} z_a & x_a \\\\ z_b & x_b \\end{vmatrix} = 2 \\cdot 2 - 1 \\cdot (-1) = 4 + 1 = 5$$\n$$z_c = \\begin{vmatrix} x_a & y_a \\\\ x_b & y_b \\end{vmatrix} = 1 \\cdot 1 - 0 \\cdot 2 = 1$$\n\nVậy $[\\vec{a}, \\vec{b}] = (-2; 5; 1)$.'
  },
  {
    id: 13,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, tính cosin góc giữa hai vectơ $\\vec{a} = (1; 1; 0)$ và $\\vec{b} = (0; 1; 1)$.',
    options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{2}}{2}$', '0', '1'],
    correctIndex: 0,
    explanation: 'Công thức tính cosin góc giữa hai vectơ:\n\n$$\\cos(\\vec{a}, \\vec{b}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}| \\cdot |\\vec{b}|}$$\n\n1. Tính tích vô hướng:\n$$\\vec{a} \\cdot \\vec{b} = 1 \\cdot 0 + 1 \\cdot 1 + 0 \\cdot 1 = 1$$\n\n2. Tính độ dài từng vectơ:\n$$|\\vec{a}| = \\sqrt{1^2 + 1^2 + 0^2} = \\sqrt{2}$$\n$$|\\vec{b}| = \\sqrt{0^2 + 1^2 + 1^2} = \\sqrt{2}$$\n\n3. Tính cosin:\n$$\\cos(\\vec{a}, \\vec{b}) = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2}$$'
  },
  {
    id: 14,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, tính khoảng cách từ điểm $M(1; 2; 3)$ đến mặt phẳng $(P): 2x - y + 2z + 3 = 0$.',
    options: ['3', '9', '1', '$\\frac{7}{3}$'],
    correctIndex: 0,
    explanation: 'Công thức khoảng cách từ điểm $M(x_0; y_0; z_0)$ đến mặt phẳng $(P): Ax + By + Cz + D = 0$ là:\n\n$$d(M, (P)) = \\frac{|A x_0 + B y_0 + C z_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$\n\nThay số liệu vào công thức:\n$$d(M, (P)) = \\frac{|2 \\cdot 1 - 2 + 2 \\cdot 3 + 3|}{\\sqrt{2^2 + (-1)^2 + 2^2}}$$\n$$d(M, (P)) = \\frac{|2 - 2 + 6 + 3|}{\\sqrt{4 + 1 + 4}} = \\frac{9}{\\sqrt{9}} = \\frac{9}{3} = 3$$'
  },
  {
    id: 15,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Cho hình hộp $ABCD.A\'B\'C\'D\'$ có ba vectơ chung đỉnh gồm $\\vec{AB} = (1; 0; 0)$, $\\vec{AD} = (0; 2; 0)$, $\\vec{AA\'} = (0; 0; 3)$. Tính thể tích $V$ của hình hộp này.',
    options: ['6', '2', '1', '12'],
    correctIndex: 0,
    explanation: 'Thể tích $V$ của hình hộp nhận 3 vectơ $\\vec{a}, \\vec{b}, \\vec{c}$ làm cạnh chung đỉnh được xác định bằng đạo hàm tích hỗn tạp:\n\n$$V = \\left| [\\vec{AB}, \\vec{AD}] \\cdot \\vec{AA\'} \\right|$$\n\n1. Tính tích có hướng $[\\vec{AB}, \\vec{AD}]$:\n- $\\vec{AB} = (1; 0; 0)$ và $\\vec{AD} = (0; 2; 0)$\n$$[\\vec{AB}, \\vec{AD}] = (0 \\cdot 0 - 0 \\cdot 2; 0 \\cdot 0 - 1 \\cdot 0; 1 \\cdot 2 - 0 \\cdot 0) = (0; 0; 2)$$\n\n2. Nhân vô hướng với $\\vec{AA\'} = (0; 0; 3)$:\n$$[\\vec{AB}, \\vec{AD}] \\cdot \\vec{AA\'} = (0; 0; 2) \\cdot (0; 0; 3) = 0 \\cdot 0 + 0 \\cdot 0 + 2 \\cdot 3 = 6$$\n\nVậy thể tích hình hộp bằng **6**.'
  },
  {
    id: 16,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{u} = (2; -3; 1)$ và $\\vec{v} = (1; 1; 1)$. Tính tích vô hướng $\\vec{u} \\cdot \\vec{v}$.',
    options: ['0', '6', '-2', '2'],
    correctIndex: 0,
    explanation: 'Áp dụng công thức tích vô hướng giữa hai vectơ:\n\n$$\\vec{u} \\cdot \\vec{v} = u_1 \\cdot v_1 + u_2 \\cdot v_2 + u_3 \\cdot v_3$$\n$$\\vec{u} \\cdot \\vec{v} = 2 \\cdot 1 + (-3) \\cdot 1 + 1 \\cdot 1 = 2 - 3 + 1 = 0$$\n\nVì tích vô hướng bằng 0, điều này cũng có nghĩa là hai vectơ này có hướng vuông góc với nhau.'
  },
  {
    id: 17,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, tính khoảng cách từ gốc tọa độ $O(0; 0; 0)$ đến mặt phẳng $(Q): x + 2y - 2z + 6 = 0$.',
    options: ['2', '6', '3', '1'],
    correctIndex: 0,
    explanation: 'Tính khoảng cách từ điểm gốc tọa độ $O(0; 0; 0)$ đến mặt phẳng $(Q): x + 2y - 2z + 6 = 0$:\n\n$$d(O, (Q)) = \\frac{|0 + 2 \\cdot 0 - 2 \\cdot 0 + 6|}{\\sqrt{1^2 + 2^2 + (-2)^2}}$$\n$$d(O, (Q)) = \\frac{|6|}{\\sqrt{1 + 4 + 4}} = \\frac{6}{\\sqrt{9}} = \\frac{6}{3} = 2$$'
  },
  {
    id: 18,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Cho ba vectơ chung đỉnh trong không gian tạo thành một hình hộp: $\\vec{a} = (2; 0; 0)$, $\\vec{b} = (0; 1; 5)$, $\\vec{c} = (0; 0; 2)$. Tính thể tích $V$ của hình hộp này.',
    options: ['4', '20', '8', '12'],
    correctIndex: 0,
    explanation: 'Áp dụng công thức thể tích hình hộp:\n\n$$V = \\left| [\\vec{a}, \\vec{b}] \\cdot \\vec{c} \\right|$$\n\n1. Ta tính tích có hướng $[\\vec{a}, \\vec{b}]$ với $\\vec{a}=(2;0;0)$ và $\\vec{b}=(0;1;5)$:\n$$x = 0 \\cdot 5 - 0 \\cdot 1 = 0$$\n$$y = 0 \\cdot 0 - 2 \\cdot 5 = -10$$\n$$z = 2 \\cdot 1 - 0 \\cdot 0 = 2$$\n$$[\\vec{a}, \\vec{b}] = (0; -10; 2)$$\n\n2. Nhân vô hướng với $\\vec{c}=(0;0;2)$:\n$$[\\vec{a}, \\vec{b}] \\cdot \\vec{c} = 0 \\cdot 0 + (-10) \\cdot 0 + 2 \\cdot 2 = 4$$\n\nVậy thể tích hình hộp bằng **4**.'
  },
  {
    id: 19,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Tính tích vô hướng của hai vectơ đơn vị trên các trục tọa độ là $\\vec{i} = (1; 0; 0)$ và $\\vec{j} = (0; 1; 0)$.',
    options: ['0', '1', '$(0; 0; 0)$', '2'],
    correctIndex: 0,
    explanation: 'Tính trực tiếp theo công thức nhân vô hướng:\n\n$$\\vec{i} \\cdot \\vec{j} = 1 \\cdot 0 + 0 \\cdot 1 + 0 \\cdot 0 = 0$$\n\n*Giải thích hình học:* Vectơ $\\vec{i}$ nằm trên trục hoành Ox, còn $\\vec{j}$ nằm trên trục tung Oy. Vì hai trục hệ tọa độ này vuông góc với nhau, tích vô hướng của hai vectơ chỉ phương của chúng bằng **0**.'
  },
  {
    id: 20,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{a} = (1; 2; -1)$ và $\\vec{b} = (3; 4; 2)$. Tìm tọa độ vectơ tích có hướng $[\\vec{a}, \\vec{b}]$.',
    options: ['$(8; -5; -2)$', '$(8; 5; -2)$', '$(-4; -5; -2)$', '$(8; -5; 2)$'],
    correctIndex: 0,
    explanation: 'Tính tích có hướng $[\\vec{a}, \\vec{b}] = (x_c; y_c; z_c)$:\n\n$$x_c = \\begin{vmatrix} 2 & -1 \\\\ 4 & 2 \\end{vmatrix} = 2 \\cdot 2 - (-1) \\cdot 4 = 4 + 4 = 8$$\n$$y_c = \\begin{vmatrix} -1 & 1 \\\\ 2 & 3 \\end{vmatrix} = (-1) \\cdot 3 - 1 \\cdot 2 = -3 - 2 = -5$$\n$$z_c = \\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix} = 1 \\cdot 4 - 2 \\cdot 3 = 4 - 6 = -2$$\n\nVậy $[\\vec{a}, \\vec{b}] = (8; -5; -2)$.'
  },
  {
    id: 21,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, tính cosin góc giữa hai vectơ cùng phương ngược hướng $\\vec{u}$ và $\\vec{v}$.',
    options: ['-1', '1', '0', '$\\frac{1}{2}$'],
    correctIndex: 0,
    explanation: 'Hai vectơ cùng phương và ngược hướng thì góc tạo bởi giữa chúng có giá trị bằng $180^\\circ$ (hay $\\pi$ radian).\n\nDo đó:\n$$\\cos(\\vec{u}, \\vec{v}) = \\cos(180^\\circ) = -1$$'
  },
  {
    id: 22,
    sectionId: 'section3',
    sectionTitle: 'Phần 3: Hình học không gian Oxyz',
    questionText: 'Trong không gian $Oxyz$, tính khoảng cách từ điểm $A(1; 0; 0)$ đến mặt phẳng tọa độ $(Oyz): x = 0$.',
    options: ['1', '0', '2', '$\\sqrt{1}$'],
    correctIndex: 0,
    explanation: 'Mặt phẳng $(Oyz)$ có phương trình tổng quát là $x = 0$.\n\nKhoảng cách từ điểm $A(x_0; y_0; z_0)$ đến mặt phẳng $(Oyz)$ là:\n\n$$d(A, (Oyz)) = |x_0|$$\n\nVới điểm $A(1; 0; 0)$, ta có hoành độ $x_0 = 1$:\n$$d(A, (Oyz)) = |1| = 1$$'
  },

  // --- PHẦN 4: CẤP SỐ CỘNG VÀ CẤP SỐ NHÂN ---
  {
    id: 23,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1 = 3$ và công bội $q = 2$. Tìm số hạng thứ 4 ($u_4$) của cấp số nhân đó.',
    options: ['24', '18', '48', '9'],
    correctIndex: 0,
    explanation: 'Số hạng tổng quát của cấp số nhân được tính bằng công thức:\n\n$$u_n = u_1 \\cdot q^{n-1}$$\n\nÁp dụng số hạng thứ 4 ($n=4$):\n$$u_4 = u_1 \\cdot q^{4-1} = 3 \\cdot 2^3 = 3 \\cdot 8 = 24$$'
  },
  {
    id: 24,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 5$ và công sai $d = 3$. Tìm số hạng thứ 10 ($u_{10}$) của cấp số cộng đó.',
    options: ['32', '35', '15', '27'],
    correctIndex: 0,
    explanation: 'Số hạng tổng quát của một cấp số cộng là:\n\n$$u_n = u_1 + (n-1)d$$\n\nThay các giá trị tương ứng để tìm số hạng thứ 10 ($n=10$):\n$$u_{10} = u_1 + 9d = 5 + 9 \\cdot 3 = 5 + 27 = 32$$'
  },
  {
    id: 25,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho cấp số cộng $(u_n)$ biết số hạng đầu $u_1 = 2$ và số hạng thứ hai $u_2 = 6$. Tính tổng của 5 số hạng đầu tiên ($S_5$) của cấp số cộng đó.',
    options: ['50', '30', '40', '62'],
    correctIndex: 0,
    explanation: '1. Tìm công sai $d$ của cấp số cộng:\n$$d = u_2 - u_1 = 6 - 2 = 4$$\n\n2. Áp dụng công thức tính tổng $n$ số hạng đầu tiên:\n$$S_n = \\frac{n}{2} \\cdot \\left[ 2u_1 + (n-1)d \\right]$$\n\nVới $n = 5$:\n$$S_5 = \\frac{5}{2} \\cdot \\left[ 2 \\cdot 2 + (5-1) \\cdot 4 \\right] = \\frac{5}{2} \\cdot [4 + 16] = \\frac{5}{2} \\cdot 20 = 50$$\n\n*(Cách khác: Liệt kê bốc thêm 5 số hạng: 2, 6, 10, 14, 18. Cộng lại: 2 + 6 + 10 + 14 + 18 = 50).*'
  },
  {
    id: 26,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1 = 1$ và công bội $q = 3$. Tính tổng của 4 số hạng đầu tiên ($S_4$) của cấp số nhân này.',
    options: ['40', '120', '81', '39'],
    correctIndex: 0,
    explanation: 'Áp dụng công thức tính tổng $n$ số hạng đầu của một cấp số nhân:\n\n$$S_n = u_1 \\cdot \\frac{q^n - 1}{q - 1}$$\n\nVới $n=4, u_1=1, q=3$:\n$$S_4 = 1 \\cdot \\frac{3^4 - 1}{3 - 1} = \\frac{81 - 1}{2} = \\frac{80}{2} = 40$$\n\n*(Cách khác: Cộng trực tiếp các số hạng: u1=1, u2=3, u3=9, u4=27. Tổng là 1 + 3 + 9 + 27 = 40).*'
  },
  {
    id: 27,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho một cấp số cộng $(u_n)$ có $u_1 = -2$ và $u_5 = 10$. Xác định công sai $d$ của cấp số cộng này.',
    options: ['3', '2.4', '4', '2'],
    correctIndex: 0,
    explanation: 'Dựa trên công thức số hạng tổng quát:\n\n$$u_5 = u_1 + 4d$$\n$$10 = -2 + 4d$$\n$$4d = 12 \\implies d = 3$$\n\nVậy công sai của cấp số cộng này bằng **3**.'
  },
  {
    id: 28,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1 = 2$ và số hạng thứ ba $u_3 = 18$. Biết công bội $q$ mang giá trị dương, hãy tìm $q$.',
    options: ['3', '9', '-3', '4'],
    correctIndex: 0,
    explanation: 'Theo công thức cấp số nhân:\n\n$$u_3 = u_1 \\cdot q^2$$\n$$18 = 2 \\cdot q^2 \\implies q^2 = 9$$\n\nVì đề bài cho công bội $q$ mang giá trị dương nên:\n$$q = \\sqrt{9} = 3$$'
  },
  {
    id: 29,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho ba số hạng liên tiếp của một cấp số cộng là $x, 7, 11$. Tìm giá trị của số hạng $x$.',
    options: ['3', '4', '5', '2'],
    correctIndex: 0,
    explanation: 'Ba số hạng liên tiếp lập thành cấp số cộng thì số hạng đứng giữa bằng trung bình cộng hai số kế liền nó:\n\n$$7 = \\frac{x + 11}{2}$$\n$$2 \\cdot 7 = x + 11 \\implies 14 = x + 11 \\implies x = 3$$'
  },
  {
    id: 30,
    sectionId: 'section4',
    sectionTitle: 'Phần 4: Cấp số cộng và Cấp số nhân',
    questionText: 'Cho ba số hạng liên tiếp của một cấp số nhân gồm các số dương: $2, x, 8$. Tìm giá trị số dương $x$.',
    options: ['4', '5', '16', '-4'],
    correctIndex: 0,
    explanation: 'Để ba số liên tiếp lập thành một cấp số nhân thì bình phương số ở giữa bằng tích hai số hai bên:\n\n$$x^2 = 2 \\cdot 8$$\n$$x^2 = 16 \\implies [x = 4 \\text{ hoặc } x = -4]$$\n\nVì đề bài chỉ rõ các số hạng đều là **số dương** nên ta chọn $x = 4$.'
  }
];
