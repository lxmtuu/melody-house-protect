# 🎹 Melody House - Fullstack Web MIDI Piano Platform

Melody House là một nền tảng Web Piano thế hệ mới, hỗ trợ kết nối trực tiếp với đàn Piano thật qua cáp USB MIDI, cùng hệ thống trực quan hóa (Visualizer) rơi nốt nhạc cực kì bắt mắt phong cách Synthesia.

## ✨ Tính năng nổi bật
*   **Web MIDI API**: Cắm đàn Piano/Keyboard thật vào máy tính và chơi trực tiếp trên trình duyệt. Nhận diện cả 3 Pedal (Sustain, Soft, Sostenuto) và lực gõ (Velocity).
*   **Advanced Visualizer**: Hiệu ứng Nốt nhạc rơi, quầng sáng Glow, Hạt bụi Particles vật lý 3D. Cho phép tùy chỉnh hình nền, đảo hướng rơi, đổi màu đèn dạ quang.
*   **Tone.js Audio Engine**: Tích hợp âm thanh giả lập E-Piano, 8-Bit và bộ Sample thu âm thật từ đàn Salamander Grand Piano.
*   **Quản lý Sheet/MIDI**: Tải lên (Upload) file PDF bản nhạc và file `.mid`, hệ thống sẽ đọc và tự động phát nhạc rơi nốt để người dùng luyện tập theo.
*   **Hệ thống User**: Đăng nhập/Đăng ký bằng JWT (JSON Web Token) để lưu bài hát yêu thích.

## 🛠️ Công nghệ sử dụng (Tech Stack)
*   **Frontend**: React (Vite), TypeScript, TailwindCSS, Lucide Icons, Tone.js, @tonejs/midi.
*   **Backend**: Node.js, Express.js, Prisma ORM.
*   **Database**: SQLite (Bản Local) - Rất nhẹ, lưu trong 1 file `melody.db`, không cần cài đặt rườm rà.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT (SETUP LOCAL)

### Yêu cầu tiên quyết (Prerequisites)
1. **Node.js**: Máy tính của bạn phải được cài đặt Node.js (phiên bản v18 hoặc v20+). Tải tại: [nodejs.org](https://nodejs.org/).
2. Một trình duyệt hỗ trợ Web MIDI (Google Chrome, Microsoft Edge, Opera). *Lưu ý: Safari và Firefox có thể bị hạn chế tính năng Web MIDI*.

### Bước 1: Tải mã nguồn về máy
Sau khi tải toàn bộ folder của dự án về máy, hãy mở **Terminal (hoặc Command Prompt / PowerShell / VS Code Terminal)** và trỏ đường dẫn vào thư mục gốc của dự án.

### Bước 2: Cài đặt thư viện (Install Dependencies)
Chạy lệnh sau tại thư mục gốc để cài đặt tự động tất cả thư viện cho cả Frontend, Backend và Root:
```bash
npm run install:all
```

### Bước 3: Khởi tạo Database (Database Migration)
Ứng dụng sử dụng Prisma + SQLite. Bạn cần chạy lệnh sau để tạo file Database và dữ liệu mẫu (Seed 3 bài hát có sẵn):
```bash
npm run db:push
```

### Bước 4: Khởi động Ứng dụng (Start the App)
Vẫn ở Terminal tại thư mục gốc, gõ lệnh:
```bash
npm start
```

Lệnh này sẽ dùng `concurrently` để chạy song song 2 server:
*   **Backend API** sẽ chạy tại: `http://localhost:3001`
*   **Frontend Web** sẽ chạy tại: `http://localhost:3000`

👉 Trình duyệt sẽ tự động mở trang Frontend (hoặc bạn có thể tự truy cập `http://localhost:3000`).

---

## 🎹 CÁCH TEST VÀ TRẢI NGHIỆM
1. **Âm thanh Piano thật**: Lần đầu vào trang, do chính sách trình duyệt (Auto-play policy), bạn cần click chuột hoặc gõ 1 phím bất kì trên màn hình để bật Audio Engine lên.
2. **Cắm đàn thật**: Dùng cáp chuyển đổi USB/MIDI cắm Piano điện của bạn vào máy tính. Trình duyệt có thể sẽ hiện một popup hỏi "Cho phép truy cập thiết bị MIDI", hãy nhấn **Cho phép (Allow)**. Đèn trạng thái trên web sẽ báo Xanh lá "Đã kết nối".
3. **Thêm bài hát**: Vào mục Tải lên -> Điền tên bài hát -> Tải lên 1 file `.mid` bất kì tải từ trên mạng. Sau đó vào Thư viện -> Luyện tập -> Bấm nút Play màu xanh lá để xem dàn giao hưởng ánh sáng!

🎉 Chúc bạn có những giờ phút luyện tập và thư giãn tuyệt vời cùng Melody House!
