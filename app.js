/**
 * ============================================================================
 * FIT30 — 30 MINUTES TO A BETTER YOU | FRONTEND APPLICATION LOGIC
 * ============================================================================
 * Không sử dụng React/Vue/Angular hoặc framework build. Chạy trực tiếp trên trình duyệt.
 * Kết nối với Google Apps Script Backend thông qua giao thức CORS-safelisted POST & GET.
 * ============================================================================
 */

// ==================== 1. CẤU HÌNH KẾT NỐI BACKEND ====================
// Thay thế URL dưới đây bằng URL Web App Apps Script của bạn sau khi deploy:
var GAS_API_URL = "https://script.google.com/macros/s/AKfycbyo1AQkT8mHvGljs6ZhCh4lTcRUEiu2ID0w8qVZoI-B80ECeXo48oE8daPR0Uz2GQ8vWA/exec";

// ==================== 2. KHO BÀI TẬP & VIDEO ĐÃ NGHIÊN CỨU ====================
// Mỗi bài tập đều có YouTube ID video hướng dẫn thực tế, tên song ngữ, nhóm cơ và lưu ý an toàn.
var EXERCISE_DATABASE = [
  {
    id: "ex_warmup_march",
    nameVi: "Khởi động: Đi bộ tại chỗ kết hợp xoay khớp",
    nameEn: "Warm-up: March in Place & Arm Circles",
    descriptionVi: "Làm nóng các nhóm cơ lớn, tăng nhịp tim dần dần và bôi trơn các khớp gối, cổ chân, vai trước khi vào bài chính.",
    descriptionEn: "Gentle march on the spot while circling shoulders and ankles to prepare joints and elevate heart rate safely.",
    durationSeconds: 300, // 5 phút khởi động
    restSeconds: 20,
    sets: 1,
    youtubeId: "D0GwAezTvtg",
    videoUrl: "https://www.youtube.com/watch?v=D0GwAezTvtg",
    thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Toàn thân", "Cơ tim", "Khớp gối", "Khớp vai"],
    difficulty: "Dễ (Khởi động)",
    calorieNote: "Ước tính tiêu hao 25 - 35 kcal",
    beginnerAlternative: "Đi bộ tốc độ chậm, không cần nâng cao chân nếu khớp gối bị cứng.",
    safetyNotes: "Tiếp đất êm ái bằng nửa bàn chân trước rồi hạ gót, không dậm mạnh chân xuống sàn."
  },
  {
    id: "ex_high_knees",
    nameVi: "Nâng gối tại chỗ (Phiên bản Low-Impact March)",
    nameEn: "High Knees / Low-Impact March",
    descriptionVi: "Nâng đùi luân phiên lên độ cao ngang hông kết hợp vung tay đối nghịch theo nhịp. Đốt mỡ thừa vùng đùi và kích hoạt cơ bụng dưới.",
    descriptionEn: "Alternate lifting knees towards hip height with opposite arm drive. Excellent for cardio and lower abs.",
    durationSeconds: 40,
    restSeconds: 20,
    sets: 3,
    youtubeId: "D0GwAezTvtg",
    videoUrl: "https://www.youtube.com/watch?v=D0GwAezTvtg",
    thumbnailUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Cơ đùi trước (Quads)", "Cơ gấp hông (Hip Flexors)", "Cơ bụng dưới"],
    difficulty: "Trung bình",
    calorieNote: "Ước tính tiêu hao 45 - 60 kcal cho 3 hiệp",
    beginnerAlternative: "Bước nâng gối có kiểm soát không bật nhảy (Low-impact) để triệt tiêu chấn động lên đầu gối.",
    safetyNotes: "Giữ thân người thẳng đứng, không ngả lưng về sau khi nâng gối."
  },
  {
    id: "ex_squat",
    nameVi: "Squat cơ bản trọng lượng cơ thể",
    nameEn: "Bodyweight Squat",
    descriptionVi: "Động tác căn bản kích hoạt nhóm cơ lớn nhất cơ thể: đùi trước, cơ mông và gân kheo, giúp tăng tốc độ trao đổi chất mạnh mẽ.",
    descriptionEn: "The king of lower body movements. Targets quads, glutes, and hamstrings for maximum metabolic burn.",
    durationSeconds: 45,
    restSeconds: 20,
    sets: 3,
    youtubeId: "aclHkVaku9U",
    videoUrl: "https://www.youtube.com/watch?v=aclHkVaku9U",
    thumbnailUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Cơ tứ đầu đùi (Quads)", "Cơ mông lớn (Glutes)", "Cơ đùi sau"],
    difficulty: "Trung bình",
    calorieNote: "Ước tính tiêu hao 50 - 70 kcal cho 3 hiệp",
    beginnerAlternative: "Box Squat: Đặt một chiếc ghế phía sau và hạ người ngồi chạm nhẹ ghế rồi đứng lên.",
    safetyNotes: "Mở gối theo hướng mũi chân, đẩy hông ra sau như ngồi vào ghế, không để đầu gối chụm vào nhau."
  },
  {
    id: "ex_step_jack",
    nameVi: "Step Jack (Jumping Jack không gây áp lực khớp)",
    nameEn: "Low-Impact Step Jack",
    descriptionVi: "Bước chân sang ngang luân phiên kết hợp dang hai tay lên cao qua đầu. Tăng nhịp tim đốt calo mà không gây chấn động lên cột sống và khớp gối.",
    descriptionEn: "Step feet alternately side to side while raising arms overhead. Cardio workout without joint impact.",
    durationSeconds: 45,
    restSeconds: 15,
    sets: 3,
    youtubeId: "uft6Ke3xFEY",
    videoUrl: "https://www.youtube.com/watch?v=uft6Ke3xFEY",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Bắp chuối", "Cơ vai", "Hông ngoài", "Hệ tim mạch"],
    difficulty: "Dễ - Thích hợp người thừa cân",
    calorieNote: "Ước tính tiêu hao 40 - 55 kcal cho 3 hiệp",
    beginnerAlternative: "Thực hiện biên độ tay nhỏ hơn (vung tay ngang vai) nếu thấy mỏi khớp vai.",
    safetyNotes: "Giữ nhịp thở đều: hít vào khi thu chân, thở ra khi bước chân và đưa tay lên."
  },
  {
    id: "ex_reverse_lunge",
    nameVi: "Reverse Lunge (Chùng chân về sau an toàn khớp gối)",
    nameEn: "Bodyweight Reverse Lunge",
    descriptionVi: "Bước lùi chân về sau và hạ hông vuông góc. Bước lùi giúp giảm đáng kể lực ép lên bánh chè so với lunge bước tới trước.",
    descriptionEn: "Stepping backwards into a lunge to protect knees while strengthening glutes and quads.",
    durationSeconds: 40,
    restSeconds: 20,
    sets: 3,
    youtubeId: "7xnhSAlxNjw",
    videoUrl: "https://www.youtube.com/watch?v=7xnhSAlxNjw",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Cơ mông", "Cơ đùi trước", "Cơ thăng bằng cốt lõi"],
    difficulty: "Trung bình",
    calorieNote: "Ước tính tiêu hao 45 - 60 kcal cho 3 hiệp",
    beginnerAlternative: "Vịn một tay vào tường hoặc cạnh bàn chắc chắn để giữ thăng bằng.",
    safetyNotes: "Đầu gối chân trước không vượt quá mũi chân; thân người hơi nghiêng nhẹ về trước để kích hoạt cơ mông."
  },
  {
    id: "ex_mountain_climber",
    nameVi: "Mountain Climber (Leo núi chậm có kiểm soát)",
    nameEn: "Slow Mountain Climber",
    descriptionVi: "Ở tư thế chống đẩy cao, luân phiên kéo gối về phía ngực một cách nhịp nhàng. Siết chặt toàn bộ vùng bụng và rèn luyện cơ vai.",
    descriptionEn: "High plank position, rhythmically driving knees to chest. High calorie burn and core strengthening.",
    durationSeconds: 35,
    restSeconds: 25,
    sets: 3,
    youtubeId: "nmwgirgXLYM",
    videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    thumbnailUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Cơ bụng toàn diện (Abs & Core)", "Cơ vai", "Cơ ngực"],
    difficulty: "Trung bình khá",
    calorieNote: "Ước tính tiêu hao 50 - 65 kcal cho 3 hiệp",
    beginnerAlternative: "Chống hai tay lên ghế sofa hoặc bậc thềm cao (Incline Mountain Climber) để giảm tải trọng lượng cơ thể.",
    safetyNotes: "Cổ tay đặt thẳng dưới vai, không đẩy mông nhô lên quá cao hoặc võng thắt lưng."
  },
  {
    id: "ex_bird_dog",
    nameVi: "Bird Dog (Tăng cường cơ lưng dưới & thăng bằng)",
    nameEn: "Bird Dog Core Stabilizer",
    descriptionVi: "Quỳ bốn điểm, vươn thẳng tay phải về trước và chân trái về sau. Bài tập an toàn hàng đầu giúp bảo vệ cột sống và săn chắc vòng bụng.",
    descriptionEn: "Quadruped position, extending opposite arm and leg. Top tier spine-friendly core strengthening exercise.",
    durationSeconds: 45,
    restSeconds: 20,
    sets: 3,
    youtubeId: "wiFNA3sqjCA",
    videoUrl: "https://www.youtube.com/watch?v=wiFNA3sqjCA",
    thumbnailUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Cơ dựng gai sống (Erector Spinae)", "Cơ mông", "Cơ bụng ngang sâu"],
    difficulty: "Dễ - Phục hồi cột sống",
    calorieNote: "Ước tính tiêu hao 30 - 40 kcal cho 3 hiệp",
    beginnerAlternative: "Chỉ nâng chân hoặc chỉ nâng tay từng bộ phận nếu chưa đủ khả năng giữ thăng bằng cả hai.",
    safetyNotes: "Giữ hông luôn song song với mặt đất, không xoay vẹo xương chậu."
  },
  {
    id: "ex_cooldown_stretch",
    nameVi: "Hạ nhiệt: Kéo giãn cơ bắp & điều hòa nhịp thở",
    nameEn: "Cool-Down: Static Stretch & Deep Breathing",
    descriptionVi: "Thả lỏng các nhóm cơ đùi, mông, ngực và lưng, đưa nhịp tim về trạng thái nghỉ ngơi bình thường và giảm đau mỏi sau tập.",
    descriptionEn: "Gentle static stretches for lower and upper body combined with calm diaphragmatic breathing.",
    durationSeconds: 300, // 5 phút hạ nhiệt
    restSeconds: 0,
    sets: 1,
    youtubeId: "3yUoaOBZJ28",
    videoUrl: "https://www.youtube.com/watch?v=3yUoaOBZJ28",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60",
    muscleGroups: ["Toàn bộ cơ thể", "Hệ thần kinh giao cảm"],
    difficulty: "Dễ (Thư giãn)",
    calorieNote: "Ước tính tiêu hao 15 - 20 kcal",
    beginnerAlternative: "Ngồi trên thảm hoặc ghế để thực hiện các động tác kéo giãn nếu quá mệt.",
    safetyNotes: "Hít thở sâu bằng bụng: hít vào bằng mũi 4 giây, giữ 2 giây, thở ra chậm bằng miệng 6 giây."
  }
];

// Lịch tập mẫu 7 ngày trong tuần cho nam giới giảm mỡ thừa cân tại nhà
var WEEKLY_PROGRAM = [
  { dayIndex: 1, dayNameVi: "Thứ Hai", type: "Tập chính", title: "Cardio & Đốt Mỡ Cơ Bản", durationMin: 30, isRest: false },
  { dayIndex: 2, dayNameVi: "Thứ Ba", type: "Vận động nhẹ", title: "Đi Bộ Nhanh & Kéo Giãn Phục Hồi", durationMin: 30, isRest: false },
  { dayIndex: 3, dayNameVi: "Thứ Tư", type: "Tập chính", title: "Sức Bền Kháng Lực Thân Dưới & Core", durationMin: 30, isRest: false },
  { dayIndex: 4, dayNameVi: "Thứ Năm", type: "Nghỉ ngơi", title: "Nghỉ Ngơi Phục Hồi Cơ Khớp", durationMin: 0, isRest: true },
  { dayIndex: 5, dayNameVi: "Thứ Sáu", type: "Tập chính", title: "Toàn Thân Kích Hoạt Trao Đổi Chất", durationMin: 30, isRest: false },
  { dayIndex: 6, dayNameVi: "Thứ Bảy", type: "Tập chính", title: "Core & Sức Bền Kháng Mỡ", durationMin: 30, isRest: false },
  { dayIndex: 0, dayNameVi: "Chủ Nhật", type: "Vận động tự do", title: "Đi Bộ Ngoài Trời Thư Giãn", durationMin: 30, isRest: false }
];

// ==================== 3. TRÌNH TẠO ÂM THANH (WEB AUDIO API) ====================
// Không cần tải file MP3 bên ngoài, tự sinh âm thanh thông qua Web Audio API trình duyệt.
var SoundEffects = {
  ctx: null,
  enabled: true,

  init: function() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  },

  playTone: function(frequency, type, duration, delay) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      var now = this.ctx.currentTime + (delay || 0);
      var osc = this.ctx.createOscillator();
      var gain = this.ctx.createGain();

      osc.type = type || "sine";
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Bỏ qua lỗi trình duyệt cấm phát âm thanh khi chưa có cử chỉ người dùng
    }
  },

  beepCountdown: function() {
    this.playTone(600, "sine", 0.12, 0);
  },

  beepStartExercise: function() {
    this.playTone(880, "triangle", 0.25, 0);
    this.playTone(1174.66, "triangle", 0.35, 0.1);
  },

  beepRestTransition: function() {
    this.playTone(440, "sine", 0.2, 0);
  },

  beepCompleteFanfare: function() {
    this.playTone(523.25, "triangle", 0.15, 0);     // C5
    this.playTone(659.25, "triangle", 0.15, 0.15);  // E5
    this.playTone(783.99, "triangle", 0.15, 0.3);   // G5
    this.playTone(1046.50, "triangle", 0.4, 0.45);  // C6
  }
};

// ==================== 4. GIAO TIẾP VỚI APPS SCRIPT BACKEND ====================
var ApiService = {
  // Gửi POST request tương thích Vercel <-> Apps Script không bị lỗi CORS OPTIONS
  post: async function(action, data) {
    var payload = {
      action: action,
      data: data || {}
    };

    try {
      var response = await fetch(GAS_API_URL, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8" // Tránh browser kích hoạt CORS preflight OPTIONS
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Mã phản hồi HTTP từ máy chủ: " + response.status);
      }

      var resJson = await response.json();
      if (!resJson.success) {
        var msg = (resJson.error && resJson.error.message) ? resJson.error.message : "Thao tác thất bại.";
        throw new Error(msg);
      }
      return resJson.data;
    } catch (err) {
      console.warn("Lỗi gọi API Backend Apps Script:", err.message);
      throw err;
    }
  },

  // Gửi GET request có fallback
  get: async function(action, params) {
    var url = new URL(GAS_API_URL);
    url.searchParams.append("action", action);
    if (params) {
      for (var k in params) {
        url.searchParams.append(k, params[k]);
      }
    }

    try {
      var response = await fetch(url.toString(), {
        method: "GET",
        mode: "cors",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error("Lỗi HTTP GET: " + response.status);
      }

      var resJson = await response.json();
      if (!resJson.success) {
        throw new Error(resJson.error ? resJson.error.message : "Lỗi GET.");
      }
      return resJson.data;
    } catch (err) {
      console.warn("Lỗi GET Apps Script:", err.message);
      throw err;
    }
  }
};

// ==================== 5. QUẢN LÝ LƯU TRỮ CỤC BỘ (LOCAL STORAGE) ====================
var LocalStore = {
  KEYS: {
    SETTINGS: "fit30_settings",
    WORKOUTS: "fit30_workout_logs",
    WEIGHTS: "fit30_weight_logs",
    TODAY_FOODS: "fit30_today_food_logs",
    LAST_SYNC: "fit30_last_sync"
  },

  get: function(key, defaultVal) {
    try {
      var item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },

  set: function(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
};

// ==================== 6. ĐIỀU HƯỚNG GIAO DIỆN (NAVIGATION) ====================
var appNav = {
  currentTab: "dashboard",

  init: function() {
    // Lắng nghe sự kiện click trên các nút điều hướng
    var self = this;
    window.addEventListener("popstate", function(e) {
      if (e.state && e.state.tab) {
        self.goTo(e.state.tab, false);
      }
    });
  },

  goTo: function(tabId, pushState) {
    if (pushState !== false) {
      history.pushState({ tab: tabId }, "", "#" + tabId);
    }
    this.currentTab = tabId;

    // Cập nhật hiển thị các view
    var views = document.querySelectorAll(".view-section");
    views.forEach(function(el) {
      el.classList.remove("active");
    });
    var targetView = document.getElementById("view-" + tabId);
    if (targetView) {
      targetView.classList.add("active");
    }

    // Cập nhật trạng thái active của bottom nav & sidebar
    var navBtns = document.querySelectorAll(".nav-tab-btn, .sidebar-item-btn");
    navBtns.forEach(function(btn) {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Cuộn mượt lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Gọi hook refresh dữ liệu theo từng view
    if (tabId === "dashboard") appState.refreshDashboard();
    if (tabId === "schedule") scheduleManager.renderSchedule();
    if (tabId === "progress") progressTracker.renderProgressView();
    if (tabId === "nutrition") nutritionAI.renderNutritionView();
  }
};

// ==================== 7. BỘ ĐẾM THỜI GIAN & PLAYER TẬP LUYỆN ====================
var workoutEngine = {
  sessionExercises: [],
  currentIndex: 0,
  currentPhase: "idle", // 'idle' | 'prep' | 'work' | 'rest' | 'complete'
  
  phaseDurationMs: 0,
  phaseStartTimestamp: 0,
  pausedElapsedMs: 0,
  isPaused: false,
  animationFrameId: null,

  sessionStartTime: null,
  totalSessionElapsedSeconds: 0,

  init: function() {
    this.sessionExercises = EXERCISE_DATABASE;
  },

  startTodaySession: function() {
    this.sessionExercises = EXERCISE_DATABASE;
    appNav.goTo("workout");
    this.startSessionFromIndex(0);
  },

  startSelectedScheduleSession: function() {
    this.sessionExercises = EXERCISE_DATABASE;
    appNav.goTo("workout");
    this.startSessionFromIndex(0);
  },

  startSessionFromIndex: function(index) {
    this.currentIndex = index;
    this.sessionStartTime = new Date();
    this.totalSessionElapsedSeconds = 0;
    this.loadExercise(this.currentIndex);
    this.startPreparationPhase();
  },

  loadExercise: function(index) {
    var ex = this.sessionExercises[index];
    if (!ex) return;

    document.getElementById("playerWorkoutName").textContent = "Fit30 • 30 Phút Tiêu Chuẩn";
    document.getElementById("playerExerciseIndexLabel").textContent = "Động tác " + (index + 1) + " / " + this.sessionExercises.length;
    document.getElementById("playerCurrentExName").textContent = ex.nameVi;
    document.getElementById("playerCurrentExSub").textContent = ex.nameEn + " • " + (ex.durationSeconds) + "s";
    document.getElementById("playerCurrentCues").textContent = "Lưu ý an toàn: " + ex.safetyNotes;

    // Tải video iframe YouTube an toàn
    var iframe = document.getElementById("playerIframe");
    var fallback = document.getElementById("playerVideoFallback");

    if (ex.youtubeId) {
      iframe.src = "https://www.youtube.com/embed/" + ex.youtubeId + "?enablejsapi=1&rel=0&modestbranding=1";
      iframe.style.display = "block";
      fallback.style.display = "none";
    } else {
      iframe.style.display = "none";
      fallback.style.display = "flex";
      document.getElementById("fallbackExerciseName").textContent = ex.nameVi;
      document.getElementById("fallbackExerciseCue").textContent = ex.safetyNotes;
      document.getElementById("fallbackExternalLink").href = ex.videoUrl || "#";
    }

    // Cập nhật thanh tiến độ buổi tập
    var progressPercent = Math.round((index / this.sessionExercises.length) * 100);
    document.getElementById("playerProgressFill").style.width = progressPercent + "%";
  },

  startPreparationPhase: function() {
    this.currentPhase = "prep";
    this.isPaused = false;
    this.pausedElapsedMs = 0;
    this.phaseDurationMs = 10 * 1000; // 10 giây chuẩn bị

    this.updatePhaseUI("prep", "CHUẨN BỊ BẮT ĐẦU");
    this.setPlayPauseState(true);
    SoundEffects.beepStartExercise();

    this.phaseStartTimestamp = performance.now();
    this.runTimerLoop();
  },

  startWorkPhase: function() {
    var ex = this.sessionExercises[this.currentIndex];
    this.currentPhase = "work";
    this.isPaused = false;
    this.pausedElapsedMs = 0;
    this.phaseDurationMs = ex.durationSeconds * 1000;

    this.updatePhaseUI("work", "ĐANG TẬP");
    this.setPlayPauseState(true);
    SoundEffects.beepStartExercise();

    this.phaseStartTimestamp = performance.now();
    this.runTimerLoop();
  },

  startRestPhase: function() {
    var ex = this.sessionExercises[this.currentIndex];
    var restSec = ex.restSeconds;

    // Nếu bài tập cuối cùng hoặc không có thời gian nghỉ, hoàn thành ngay
    if (this.currentIndex >= this.sessionExercises.length - 1 || restSec <= 0) {
      this.finishSession();
      return;
    }

    this.currentPhase = "rest";
    this.isPaused = false;
    this.pausedElapsedMs = 0;
    this.phaseDurationMs = restSec * 1000;

    var nextEx = this.sessionExercises[this.currentIndex + 1];
    this.updatePhaseUI("rest", "NGHỈ NGƠI (" + restSec + "s)");
    document.getElementById("playerCurrentCues").textContent = "Động tác kế tiếp: " + nextEx.nameVi;

    this.setPlayPauseState(true);
    SoundEffects.beepRestTransition();

    this.phaseStartTimestamp = performance.now();
    this.runTimerLoop();
  },

  runTimerLoop: function() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    var self = this;
    function tick() {
      if (self.isPaused) return;

      var now = performance.now();
      var elapsed = (now - self.phaseStartTimestamp) + self.pausedElapsedMs;
      var remainingMs = Math.max(0, self.phaseDurationMs - elapsed);
      var remainingSec = Math.ceil(remainingMs / 1000);

      // Định dạng hiển thị đồng hồ
      var m = Math.floor(remainingSec / 60);
      var s = remainingSec % 60;
      var timeString = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
      document.getElementById("playerTimerDigits").textContent = timeString;

      // Âm báo 3 giây đếm ngược cuối cùng
      if (remainingSec <= 3 && remainingSec > 0 && Math.floor((remainingMs % 1000)) < 40) {
        SoundEffects.beepCountdown();
      }

      if (remainingMs <= 0) {
        self.handlePhaseCompletion();
      } else {
        self.animationFrameId = requestAnimationFrame(tick);
      }
    }

    this.animationFrameId = requestAnimationFrame(tick);
  },

  handlePhaseCompletion: function() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.currentPhase === "prep") {
      this.startWorkPhase();
    } else if (this.currentPhase === "work") {
      this.startRestPhase();
    } else if (this.currentPhase === "rest") {
      this.currentIndex++;
      if (this.currentIndex < this.sessionExercises.length) {
        this.loadExercise(this.currentIndex);
        this.startWorkPhase();
      } else {
        this.finishSession();
      }
    }
  },

  togglePlayPause: function() {
    if (this.currentPhase === "idle") {
      this.startSessionFromIndex(0);
      return;
    }

    if (this.isPaused) {
      // Resume
      this.isPaused = false;
      this.phaseStartTimestamp = performance.now();
      this.setPlayPauseState(true);
      this.runTimerLoop();
    } else {
      // Pause
      this.isPaused = true;
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.pausedElapsedMs += (performance.now() - this.phaseStartTimestamp);
      this.setPlayPauseState(false);
    }
  },

  skipExercise: function() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.currentIndex < this.sessionExercises.length - 1) {
      this.currentIndex++;
      this.loadExercise(this.currentIndex);
      this.startWorkPhase();
    } else {
      this.finishSession();
    }
  },

  restartCurrentExercise: function() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.startWorkPhase();
  },

  finishSession: function() {
    this.currentPhase = "complete";
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    SoundEffects.beepCompleteFanfare();

    document.getElementById("playerProgressFill").style.width = "100%";
    document.getElementById("playerTimerDigits").textContent = "00:00";
    this.updatePhaseUI("work", "HOÀN THÀNH");

    // Hiển thị modal tổng kết buổi tập
    document.getElementById("summaryDurationVal").textContent = "30:00";
    document.getElementById("summaryExercisesVal").textContent = this.sessionExercises.length + " / " + this.sessionExercises.length;
    appUI.openModal("workoutSummaryModal");
  },

  saveCompletedWorkout: function() {
    var saveBtn = document.getElementById("btnSaveWorkoutResult");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="loading-spinner"></span> Đang lưu...';

    var todayStr = appState.getTodayString();
    var notes = document.getElementById("summaryNotesInput").value.trim();

    var workoutRecord = {
      workoutId: "fullbody_30min",
      date: todayStr,
      startTime: this.sessionStartTime ? this.sessionStartTime.toISOString() : new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: 1800,
      completedExercises: this.sessionExercises.length,
      totalExercises: this.sessionExercises.length,
      status: "completed",
      estimatedCaloriesBurned: 260,
      notes: notes
    };

    // 1. Lưu ngay vào bộ nhớ cục bộ để không mất dữ liệu
    var localLogs = LocalStore.get(LocalStore.KEYS.WORKOUTS, []);
    localLogs.unshift(workoutRecord);
    LocalStore.set(LocalStore.KEYS.WORKOUTS, localLogs);

    // 2. Đồng bộ lên Google Sheets
    ApiService.post("saveWorkoutLog", workoutRecord)
      .then(function() {
        appUI.showToast("Buổi tập đã được đồng bộ lên Google Sheets!", "success");
      })
      .catch(function(err) {
        appUI.showToast("Đã lưu trên máy (chưa đồng bộ Sheets: " + err.message + ")", "info");
      })
      .finally(function() {
        saveBtn.disabled = false;
        saveBtn.innerHTML = "LƯU KẾT QUẢ";
        appUI.closeModal("workoutSummaryModal");
        appState.refreshDashboard();
        appNav.goTo("dashboard");
      });
  },

  updatePhaseUI: function(phaseClass, pillText) {
    var pill = document.getElementById("playerStatePill");
    pill.className = "timer-state-pill " + phaseClass;
    pill.textContent = pillText;

    var card = document.getElementById("playerTimerCard");
    card.classList.remove("active-work", "active-rest");
    if (phaseClass === "work") card.classList.add("active-work");
    if (phaseClass === "rest") card.classList.add("active-rest");
  },

  setPlayPauseState: function(isPlaying) {
    var playIcon = document.getElementById("playIcon");
    var pauseIcon = document.getElementById("pauseIcon");
    var text = document.getElementById("playPauseText");

    if (isPlaying) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "inline";
      text.textContent = "TẠM DỪNG";
    } else {
      playIcon.style.display = "inline";
      pauseIcon.style.display = "none";
      text.textContent = "TIẾP TỤC";
    }
  },

  toggleSound: function() {
    SoundEffects.enabled = !SoundEffects.enabled;
    document.getElementById("soundOnIcon").style.display = SoundEffects.enabled ? "block" : "none";
    document.getElementById("soundOffIcon").style.display = SoundEffects.enabled ? "none" : "block";
    appUI.showToast(SoundEffects.enabled ? "Đã bật âm thanh hỗ trợ nhịp" : "Đã tắt âm thanh", "info");
  },

  confirmExit: function() {
    if (this.currentPhase !== "idle" && this.currentPhase !== "complete") {
      if (confirm("Buổi tập đang diễn ra. Bạn có chắc muốn dừng và quay về trang chủ?")) {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.currentPhase = "idle";
        appNav.goTo("dashboard");
      }
    } else {
      appNav.goTo("dashboard");
    }
  }
};

// ==================== 8. DINH DƯỠNG & PHÂN TÍCH ẢNH BẰNG AI GEMINI ====================
var nutritionAI = {
  currentBase64Image: null,
  currentMealType: "Bữa Sáng",
  currentAnalyzedData: null,

  init: function() {
    this.renderNutritionView();
  },

  triggerPhotoChoice: function() {
    // Ưu tiên mở camera trên điện thoại
    var cameraInput = document.getElementById("foodCameraInput");
    cameraInput.click();
  },

  handleFileSelect: function(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.match(/image.*/)) {
      appUI.showToast("Vui lòng chọn file hình ảnh hợp lệ.", "error");
      return;
    }

    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      var rawBase64 = e.target.result;
      // Nén ảnh trực tiếp trên trình duyệt qua HTML5 Canvas để giảm kích thước dưới 800KB
      self.compressImage(rawBase64, 1024, 0.75, function(compressedBase64) {
        self.currentBase64Image = compressedBase64;
        var previewWrap = document.getElementById("foodPreviewWrap");
        var previewImg = document.getElementById("foodPreviewImg");
        previewImg.src = compressedBase64;
        previewWrap.style.display = "block";

        document.getElementById("aiActionButtons").style.display = "flex";
        document.getElementById("aiResultCard").style.display = "none";
      });
    };
    reader.readAsDataURL(file);
  },

  compressImage: function(base64Str, maxDimension, quality, callback) {
    var img = new Image();
    img.onload = function() {
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      var compressed = canvas.toDataURL("image/jpeg", quality);
      callback(compressed);
    };
    img.src = base64Str;
  },

  analyzePhotoWithGemini: async function() {
    if (!this.currentBase64Image) {
      appUI.showToast("Chưa có ảnh món ăn để phân tích.", "error");
      return;
    }

    var btn = document.getElementById("btnAnalyzeFood");
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> AI ĐANG QUÉT MÓN ĂN...';

    try {
      var result = await ApiService.post("analyzeFoodImage", {
        imageBase64: this.currentBase64Image,
        mimeType: "image/jpeg"
      });

      this.currentAnalyzedData = result;
      this.displayAnalysisResults(result);
      appUI.showToast("AI đã nhận diện món ăn thành công!", "success");
    } catch (err) {
      appUI.showToast("Lỗi phân tích AI: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg><span>PHÂN TÍCH CALO BẰNG AI</span>';
    }
  },

  displayAnalysisResults: function(data) {
    var resultCard = document.getElementById("aiResultCard");
    resultCard.style.display = "block";

    var confBadge = document.getElementById("aiConfidenceBadge");
    confBadge.textContent = "ĐỘ CHÍNH XÁC: " + (data.foods[0] ? data.foods[0].confidence.toUpperCase() : "TRUNG BÌNH");

    document.getElementById("aiUncertaintyNote").textContent = data.uncertaintyNote || "Ước tính từ ảnh. Bạn có thể chỉnh sửa số liệu trước khi lưu:";

    var container = document.getElementById("editableFoodsContainer");
    container.innerHTML = "";

    // Header bảng chỉnh sửa
    var headerRow = document.createElement("div");
    headerRow.className = "food-edit-item-row";
    headerRow.style.fontWeight = "700";
    headerRow.style.fontSize = "0.75rem";
    headerRow.style.color = "var(--text-muted)";
    headerRow.innerHTML = "<div>TÊN MÓN</div><div>KHỐI LƯỢNG (g)</div><div>CALO (kcal)</div>";
    container.appendChild(headerRow);

    var self = this;
    data.foods.forEach(function(food, idx) {
      var row = document.createElement("div");
      row.className = "food-edit-item-row";
      row.innerHTML = 
        '<input type="text" class="food-input input-food-name" value="' + escapeHtml(food.name) + '" data-idx="' + idx + '">' +
        '<input type="number" class="food-input input-food-grams" value="' + food.estimatedGrams + '" data-idx="' + idx + '">' +
        '<input type="number" class="food-input input-food-cals" value="' + food.caloriesKcal + '" data-idx="' + idx + '">';
      container.appendChild(row);
    });

    // Lắng nghe thay đổi input để cập nhật tính toán
    container.querySelectorAll("input").forEach(function(input) {
      input.addEventListener("input", function() {
        self.recalculateFromInputs();
      });
    });

    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },

  recalculateFromInputs: function() {
    var names = document.querySelectorAll(".input-food-name");
    var grams = document.querySelectorAll(".input-food-grams");
    var cals = document.querySelectorAll(".input-food-cals");

    var totalCal = 0;
    var updatedFoods = [];

    for (var i = 0; i < names.length; i++) {
      var g = parseFloat(grams[i].value) || 0;
      var c = parseFloat(cals[i].value) || 0;
      totalCal += c;
      updatedFoods.push({
        name: names[i].value,
        estimatedGrams: g,
        caloriesKcal: c,
        proteinGrams: (this.currentAnalyzedData.foods[i] ? this.currentAnalyzedData.foods[i].proteinGrams : 10),
        carbsGrams: (this.currentAnalyzedData.foods[i] ? this.currentAnalyzedData.foods[i].carbsGrams : 20),
        fatGrams: (this.currentAnalyzedData.foods[i] ? this.currentAnalyzedData.foods[i].fatGrams : 5)
      });
    }

    if (this.currentAnalyzedData) {
      this.currentAnalyzedData.foods = updatedFoods;
      this.currentAnalyzedData.totalCaloriesKcal = totalCal;
    }
  },

  setMealType: function(type) {
    this.currentMealType = type;
    var buttons = document.querySelectorAll(".meal-type-tab-btn");
    buttons.forEach(function(b) {
      if (b.getAttribute("data-meal") === type) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  },

  saveCurrentMealToSheet: async function() {
    if (!this.currentAnalyzedData) return;

    var saveBtn = document.getElementById("btnSaveFoodLog");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="loading-spinner"></span> Đang lưu vào nhật ký...';

    var todayStr = appState.getTodayString();
    var foodRecord = {
      date: todayStr,
      mealType: this.currentMealType,
      foodItems: this.currentAnalyzedData.foods,
      totalCaloriesKcal: this.currentAnalyzedData.totalCaloriesKcal,
      totalProteinGrams: this.currentAnalyzedData.totalProteinGrams,
      totalCarbsGrams: this.currentAnalyzedData.totalCarbsGrams,
      totalFatGrams: this.currentAnalyzedData.totalFatGrams,
      notes: "Nhận diện qua hình ảnh AI"
    };

    // 1. Lưu local cache
    var todayLogs = LocalStore.get(LocalStore.KEYS.TODAY_FOODS, []);
    todayLogs.unshift(foodRecord);
    LocalStore.set(LocalStore.KEYS.TODAY_FOODS, todayLogs);

    // 2. Gửi backend Sheets
    try {
      await ApiService.post("saveFoodLog", foodRecord);
      appUI.showToast("Đã lưu bữa ăn vào nhật ký dinh dưỡng!", "success");
      document.getElementById("aiResultCard").style.display = "none";
      document.getElementById("foodPreviewWrap").style.display = "none";
      document.getElementById("aiActionButtons").style.display = "none";
      this.currentBase64Image = null;
      this.currentAnalyzedData = null;
      this.renderNutritionView();
      appState.refreshDashboard();
    } catch (err) {
      appUI.showToast("Lỗi lưu dữ liệu: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "LƯU VÀO NHẬT KÝ DINH DƯỠNG";
    }
  },

  renderNutritionView: function() {
    var todayStr = appState.getTodayString();
    document.getElementById("nutriDateLabel").textContent = todayStr;

    var logs = LocalStore.get(LocalStore.KEYS.TODAY_FOODS, []);
    var totalCals = 0;
    var totalPro = 0;
    var totalCarb = 0;
    var totalFat = 0;

    var listContainer = document.getElementById("todayFoodLogsList");
    if (!logs || logs.length === 0) {
      listContainer.innerHTML = '<div class="empty-state-box">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' +
        '<p>Chưa có bữa ăn nào được ghi nhận hôm nay.<br>Hãy bấm chụp ảnh để phân tích calo ngay!</p></div>';
    } else {
      var html = "";
      logs.forEach(function(item, idx) {
        totalCals += (Number(item.totalCaloriesKcal) || 0);
        totalPro += (Number(item.totalProteinGrams) || 0);
        totalCarb += (Number(item.totalCarbsGrams) || 0);
        totalFat += (Number(item.totalFatGrams) || 0);

        var foodNames = (item.foodItems || []).map(function(f) { return f.name; }).join(", ");

        html += '<div class="exercise-item-row" style="margin-bottom: 8px;">' +
          '<div class="exercise-item-info">' +
            '<div class="exercise-seq" style="font-size:0.75rem;">' + (item.mealType ? item.mealType.substring(0, 2) : "M") + '</div>' +
            '<div class="exercise-names-wrap">' +
              '<h4>' + escapeHtml(item.mealType) + ' • ' + Math.round(item.totalCaloriesKcal) + ' kcal</h4>' +
              '<p>' + escapeHtml(foodNames) + '</p>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-danger" style="padding: 6px 10px; font-size: 0.75rem;" onclick="nutritionAI.deleteFoodLogItem(' + idx + ', \'' + (item.id || "") + '\')">Xóa</button>' +
        '</div>';
      });
      listContainer.innerHTML = html;
    }

    document.getElementById("nutriTotalCalories").textContent = Math.round(totalCals);
    document.getElementById("nutriTotalProtein").textContent = Math.round(totalPro);
    document.getElementById("nutriTotalCarbs").textContent = Math.round(totalCarb);
    document.getElementById("nutriTotalFat").textContent = Math.round(totalFat);

    var settings = LocalStore.get(LocalStore.KEYS.SETTINGS, { calorieGoalDaily: 2000 });
    document.getElementById("nutriGoalTarget").textContent = settings.calorieGoalDaily || 2000;
  },

  deleteFoodLogItem: async function(index, id) {
    if (!confirm("Bạn có chắc muốn xóa bản ghi món ăn này?")) return;

    var logs = LocalStore.get(LocalStore.KEYS.TODAY_FOODS, []);
    logs.splice(index, 1);
    LocalStore.set(LocalStore.KEYS.TODAY_FOODS, logs);
    this.renderNutritionView();
    appState.refreshDashboard();

    if (id) {
      try {
        await ApiService.post("deleteFoodLog", { id: id });
        appUI.showToast("Đã xóa khỏi Google Sheets", "info");
      } catch (e) {}
    }
  }
};

// ==================== 9. TIẾN TRÌNH ĐO & VẼ BIỂU ĐỒ NATIVE SVG ====================
var progressTracker = {
  init: function() {
    var todayStr = appState.getTodayString();
    var dateInput = document.getElementById("inputLogDate");
    if (dateInput) dateInput.value = todayStr;
  },

  handleFormSubmit: async function(e) {
    e.preventDefault();
    var weight = parseFloat(document.getElementById("inputWeight").value);
    var waist = parseFloat(document.getElementById("inputWaist").value) || 0;
    var logDate = document.getElementById("inputLogDate").value;
    var notes = document.getElementById("inputWeightNotes").value.trim();

    if (isNaN(weight) || weight <= 20 || weight >= 300) {
      appUI.showToast("Cân nặng không hợp lệ.", "error");
      return;
    }

    var btn = document.getElementById("btnSaveWeight");
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Đang lưu...';

    var record = {
      date: logDate,
      weightKg: weight,
      waistCm: waist,
      notes: notes
    };

    // 1. Lưu local cache
    var list = LocalStore.get(LocalStore.KEYS.WEIGHTS, []);
    // Kiểm tra trùng ngày để cập nhật
    var existingIdx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].date === logDate) {
        existingIdx = i;
        break;
      }
    }
    if (existingIdx >= 0) {
      list[existingIdx] = record;
    } else {
      list.push(record);
    }
    list.sort(function(a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
    LocalStore.set(LocalStore.KEYS.WEIGHTS, list);

    // 2. Gửi backend
    try {
      await ApiService.post("saveWeightLog", record);
      appUI.showToast("Đã ghi nhận số đo thành công!", "success");
      document.getElementById("inputWeightNotes").value = "";
      this.renderProgressView();
      appState.refreshDashboard();
    } catch (err) {
      appUI.showToast("Đã lưu trên máy (chưa đồng bộ Sheets: " + err.message + ")", "info");
      this.renderProgressView();
    } finally {
      btn.disabled = false;
      btn.innerHTML = "LƯU SỐ ĐO";
    }
  },

  renderProgressView: function() {
    var logs = LocalStore.get(LocalStore.KEYS.WEIGHTS, []);
    var historyContainer = document.getElementById("weightHistoryList");

    if (!logs || logs.length === 0) {
      historyContainer.innerHTML = '<div class="empty-state-box">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' +
        '<p>Chưa có số đo nào.<br>Hãy nhập cân nặng đầu tiên ở biểu mẫu phía trên.</p></div>';
      document.getElementById("weightChartContainer").innerHTML = '<div class="empty-state-box" style="padding: 20px;"><p>Cần tối thiểu 2 mốc đo để vẽ biểu đồ tiến trình.</p></div>';
      return;
    }

    // Hiển thị danh sách lịch sử đo đảo ngược (mới nhất lên đầu)
    var html = "";
    var reversed = logs.slice().reverse();
    reversed.forEach(function(item, idx) {
      html += '<div class="exercise-item-row" style="margin-bottom: 8px;">' +
        '<div class="exercise-item-info">' +
          '<div class="exercise-seq" style="font-size:0.75rem;">' + (item.date ? item.date.substring(5) : "--") + '</div>' +
          '<div class="exercise-names-wrap">' +
            '<h4>' + item.weightKg + ' kg ' + (item.waistCm ? ' • Vòng bụng: ' + item.waistCm + ' cm' : '') + '</h4>' +
            '<p>' + escapeHtml(item.notes || 'Số đo định kỳ') + '</p>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-danger" style="padding: 6px 10px; font-size: 0.75rem;" onclick="progressTracker.deleteRecord(\'' + item.id + '\', ' + idx + ')">Xóa</button>' +
      '</div>';
    });
    historyContainer.innerHTML = html;

    // Vẽ biểu đồ SVG
    this.renderSvgLineChart(logs);
  },

  renderSvgLineChart: function(dataPoints) {
    var container = document.getElementById("weightChartContainer");
    if (!dataPoints || dataPoints.length < 2) {
      container.innerHTML = '<div class="empty-state-box" style="padding: 20px;"><p>Cần ít nhất 2 ngày đo để hiển thị đường xu hướng giảm mỡ.</p></div>';
      return;
    }

    var weights = dataPoints.map(function(d) { return d.weightKg; });
    var minW = Math.floor(Math.min.apply(null, weights) - 1);
    var maxW = Math.ceil(Math.max.apply(null, weights) + 1);
    var range = (maxW - minW) || 1;

    var width = container.clientWidth || 500;
    var height = 200;
    var padding = 35;

    var points = [];
    var n = dataPoints.length;
    for (var i = 0; i < n; i++) {
      var x = padding + (i / (n - 1)) * (width - padding * 2);
      var y = height - padding - ((dataPoints[i].weightKg - minW) / range) * (height - padding * 2);
      points.push({ x: x, y: y, val: dataPoints[i].weightKg, date: dataPoints[i].date });
    }

    var pathD = "M " + points[0].x + " " + points[0].y;
    for (var j = 1; j < points.length; j++) {
      pathD += " L " + points[j].x + " " + points[j].y;
    }

    // Gradient fill area
    var areaD = pathD + " L " + points[points.length - 1].x + " " + (height - padding) + " L " + points[0].x + " " + (height - padding) + " Z";

    var svgHtml = '<svg width="100%" height="100%" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none">' +
      '<defs>' +
        '<linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#10B981" stop-opacity="0.35"/>' +
          '<stop offset="100%" stop-color="#10B981" stop-opacity="0.0"/>' +
        '</linearGradient>' +
      '</defs>' +
      // Đường trục ngang mốc thấp & cao
      '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#243247" stroke-width="1"/>' +
      '<line x1="' + padding + '" y1="' + padding + '" x2="' + (width - padding) + '" y2="' + padding + '" stroke="#243247" stroke-width="1" stroke-dasharray="4"/>' +
      '<text x="' + (padding - 8) + '" y="' + (height - padding + 4) + '" fill="#6B7280" font-size="10" text-anchor="end">' + minW + 'kg</text>' +
      '<text x="' + (padding - 8) + '" y="' + (padding + 4) + '" fill="#6B7280" font-size="10" text-anchor="end">' + maxW + 'kg</text>' +
      // Vùng diện tích mờ & đường line neon
      '<path d="' + areaD + '" fill="url(#neonGradient)"/>' +
      '<path d="' + pathD + '" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';

    // Các điểm chấm tròn
    points.forEach(function(pt) {
      svgHtml += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="5" fill="#111827" stroke="#34D399" stroke-width="2.5"/>' +
        '<text x="' + pt.x + '" y="' + (pt.y - 10) + '" fill="#F9FAFB" font-size="10" font-weight="bold" text-anchor="middle">' + pt.val + '</text>';
    });

    svgHtml += '</svg>';
    container.innerHTML = svgHtml;

    // Đánh giá xu hướng
    var first = weights[0];
    var last = weights[weights.length - 1];
    var diff = Math.round((last - first) * 10) / 10;
    var trendEl = document.getElementById("chartWeightTrend");
    if (diff < 0) {
      trendEl.textContent = "Giảm " + Math.abs(diff) + " kg so với ban đầu";
      trendEl.style.color = "var(--accent-neon-bright)";
    } else if (diff > 0) {
      trendEl.textContent = "Tăng " + diff + " kg so với ban đầu";
      trendEl.style.color = "var(--accent-energy)";
    } else {
      trendEl.textContent = "Cân nặng đang duy trì ổn định";
      trendEl.style.color = "var(--text-secondary)";
    }
  },

  deleteRecord: async function(id, index) {
    if (!confirm("Bạn có chắc muốn xóa bản ghi cân nặng này?")) return;

    var logs = LocalStore.get(LocalStore.KEYS.WEIGHTS, []);
    var reversed = logs.slice().reverse();
    reversed.splice(index, 1);
    var updated = reversed.reverse();
    LocalStore.set(LocalStore.KEYS.WEIGHTS, updated);

    this.renderProgressView();
    appState.refreshDashboard();

    if (id) {
      try {
        await ApiService.post("deleteWeightLog", { id: id });
        appUI.showToast("Đã xóa trên Google Sheets", "info");
      } catch (e) {}
    }
  }
};

// ==================== 10. QUẢN LÝ LỊCH TẬP (SCHEDULE) ====================
var scheduleManager = {
  selectedDayIndex: new Date().getDay(),

  init: function() {
    this.renderSchedule();
  },

  renderSchedule: function() {
    var grid = document.getElementById("scheduleWeekGrid");
    var todayIndex = new Date().getDay();
    var self = this;

    var html = "";
    WEEKLY_PROGRAM.forEach(function(item) {
      var isToday = item.dayIndex === todayIndex;
      var isSelected = item.dayIndex === self.selectedDayIndex;

      var cls = "calendar-day-cell";
      if (isToday) cls += " today";
      if (isSelected) cls += " active";

      html += '<div class="' + cls + '" onclick="scheduleManager.selectDay(' + item.dayIndex + ')">' +
        '<div class="day-name">' + item.dayNameVi.substring(4) + '</div>' +
        '<div class="day-label">' + (item.isRest ? 'REST' : '30m') + '</div>' +
        '<div class="day-status-dot"></div>' +
      '</div>';
    });
    grid.innerHTML = html;

    this.renderSelectedDayDetail();
  },

  selectDay: function(dayIndex) {
    this.selectedDayIndex = dayIndex;
    this.renderSchedule();
  },

  renderSelectedDayDetail: function() {
    var self = this;
    var dayData = WEEKLY_PROGRAM.find(function(d) { return d.dayIndex === self.selectedDayIndex; });
    if (!dayData) return;

    document.getElementById("schedSelectedDayTag").textContent = dayData.dayNameVi.toUpperCase();
    document.getElementById("schedSelectedTypeTag").textContent = dayData.type.toUpperCase();
    document.getElementById("schedSelectedTitle").textContent = dayData.title;
    document.getElementById("schedSelectedDesc").textContent = dayData.isRest 
      ? "Hôm nay là ngày nghỉ phục hồi. Hãy ngủ đủ giấc và uống đủ 2-3 lít nước."
      : "Thời lượng 30 phút • 8 động tác chuẩn • Tự động chuyển bài và đếm ngược";

    var listContainer = document.getElementById("schedExerciseList");
    var listHtml = "";

    EXERCISE_DATABASE.forEach(function(ex, idx) {
      listHtml += '<div class="exercise-item-row" onclick="appUI.openExerciseDetailModal(\'' + ex.id + '\')">' +
        '<div class="exercise-item-info">' +
          '<div class="exercise-seq">' + (idx + 1) + '</div>' +
          '<div class="exercise-names-wrap">' +
            '<h4>' + escapeHtml(ex.nameVi) + '</h4>' +
            '<p>' + escapeHtml(ex.nameEn) + ' • ' + (ex.durationSeconds) + 's</p>' +
          '</div>' +
        '</div>' +
        '<span class="exercise-meta-tag">Xem Kỹ Thuật</span>' +
      '</div>';
    });

    listContainer.innerHTML = listHtml;
  }
};

// ==================== 11. GIAO DIỆN & MODALS (UI CONTROLLER) ====================
var appUI = {
  showToast: function(message, type) {
    var container = document.getElementById("toastContainer");
    var toast = document.createElement("div");
    toast.className = "toast-message " + (type || "info");

    var iconSvg = '<svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (type === "success") {
      iconSvg = '<svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === "error") {
      iconSvg = '<svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    toast.innerHTML = iconSvg + '<span>' + escapeHtml(message) + '</span>';
    container.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  },

  openModal: function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal: function(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  },

  openExerciseDetailModal: function(exerciseId) {
    var ex = EXERCISE_DATABASE.find(function(item) { return item.id === exerciseId; });
    if (!ex) return;

    var content = document.getElementById("exerciseModalContent");
    content.innerHTML = 
      '<div class="workout-badge-row" style="margin-bottom: 8px;">' +
        '<span class="badge-tag">' + escapeHtml(ex.difficulty) + '</span>' +
        '<span class="badge-tag" style="border-color:#3B82F6; color:#60A5FA;">' + escapeHtml(ex.muscleGroups.join(", ")) + '</span>' +
      '</div>' +
      '<h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 4px;">' + escapeHtml(ex.nameVi) + '</h3>' +
      '<p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">' + escapeHtml(ex.nameEn) + '</p>' +
      
      '<div class="video-frame-container" style="margin-bottom: 16px;">' +
        '<iframe src="https://www.youtube.com/embed/' + ex.youtubeId + '?rel=0" allowfullscreen></iframe>' +
      '</div>' +

      '<h5 style="font-size: 0.85rem; font-weight: 700; color: var(--accent-neon-bright); margin-bottom: 4px;">HƯỚNG DẪN KỸ THUẬT:</h5>' +
      '<p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.5;">' + escapeHtml(ex.descriptionVi) + '</p>' +

      '<h5 style="font-size: 0.85rem; font-weight: 700; color: #FBBF24; margin-bottom: 4px;">BIẾN THỂ DÀNH CHO NGƯỜI MỚI / THỪA CÂN:</h5>' +
      '<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">' + escapeHtml(ex.beginnerAlternative) + '</p>' +

      '<h5 style="font-size: 0.85rem; font-weight: 700; color: #F87171; margin-bottom: 4px;">LƯU Ý AN TOÀN TRÁNH CHẤN THƯƠNG:</h5>' +
      '<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">' + escapeHtml(ex.safetyNotes) + '</p>' +

      '<button class="btn btn-secondary btn-block" onclick="appUI.closeModal(\'exerciseModal\')">Đóng hướng dẫn</button>';

    this.openModal("exerciseModal");
  },

  openSettingsModal: function() {
    var settings = LocalStore.get(LocalStore.KEYS.SETTINGS, {
      targetWeightKg: 70,
      targetWaistCm: 80,
      targetWorkoutsPerWeek: 4,
      calorieGoalDaily: 2000
    });

    document.getElementById("settingTargetWeight").value = settings.targetWeightKg || 70;
    document.getElementById("settingTargetWaist").value = settings.targetWaistCm || 80;
    document.getElementById("settingTargetWorkouts").value = settings.targetWorkoutsPerWeek || 4;
    document.getElementById("settingTargetCalories").value = settings.calorieGoalDaily || 2000;

    this.openModal("settingsModal");
  },

  saveSettings: async function(e) {
    e.preventDefault();
    var btn = document.getElementById("btnSaveSettings");
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Đang lưu...';

    var newSettings = {
      targetWeightKg: parseFloat(document.getElementById("settingTargetWeight").value) || 70,
      targetWaistCm: parseFloat(document.getElementById("settingTargetWaist").value) || 80,
      targetWorkoutsPerWeek: parseInt(document.getElementById("settingTargetWorkouts").value, 10) || 4,
      calorieGoalDaily: parseInt(document.getElementById("settingTargetCalories").value, 10) || 2000
    };

    LocalStore.set(LocalStore.KEYS.SETTINGS, newSettings);

    try {
      await ApiService.post("updateSettings", newSettings);
      appUI.showToast("Đã cập nhật mục tiêu cá nhân!", "success");
      appUI.closeModal("settingsModal");
      appState.refreshDashboard();
    } catch (err) {
      appUI.showToast("Đã lưu cục bộ (chưa đồng bộ Sheets: " + err.message + ")", "info");
      appUI.closeModal("settingsModal");
      appState.refreshDashboard();
    } finally {
      btn.disabled = false;
      btn.innerHTML = "LƯU CÀI ĐẶT";
    }
  }
};

// ==================== 12. TRẠNG THÁI TOÀN CỤC & TỔNG QUAN (APP STATE) ====================
var appState = {
  init: function() {
    this.refreshDashboard();
    this.syncInitialDataFromBackend();
  },

  getTodayString: function() {
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1);
    if (m.length < 2) m = "0" + m;
    var d = String(now.getDate());
    if (d.length < 2) d = "0" + d;
    return y + "-" + m + "-" + d;
  },

  refreshDashboard: function() {
    var todayStr = this.getTodayString();
    var dateObj = new Date();
    var daysVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    document.getElementById("dashGreetingDate").textContent = daysVi[dateObj.getDay()].toUpperCase() + ", " + dateObj.toLocaleDateString("vi-VN");

    // Lấy cân nặng gần nhất
    var weights = LocalStore.get(LocalStore.KEYS.WEIGHTS, []);
    var currentWeightEl = document.getElementById("dashCurrentWeight");
    var weightDiffEl = document.getElementById("dashWeightDiff");
    var currentWaistEl = document.getElementById("dashCurrentWaist");

    if (weights && weights.length > 0) {
      var latest = weights[weights.length - 1];
      currentWeightEl.textContent = latest.weightKg;
      if (latest.waistCm) currentWaistEl.textContent = latest.waistCm;

      if (weights.length > 1) {
        var start = weights[0].weightKg;
        var diff = Math.round((latest.weightKg - start) * 10) / 10;
        if (diff < 0) {
          weightDiffEl.textContent = "Giảm " + Math.abs(diff) + " kg từ đầu";
          weightDiffEl.className = "stat-diff good";
        } else if (diff > 0) {
          weightDiffEl.textContent = "Tăng " + diff + " kg từ đầu";
          weightDiffEl.className = "stat-diff neutral";
        } else {
          weightDiffEl.textContent = "Không đổi so với ban đầu";
          weightDiffEl.className = "stat-diff neutral";
        }
      } else {
        weightDiffEl.textContent = "Mốc đo khởi đầu";
        weightDiffEl.className = "stat-diff neutral";
      }
    } else {
      currentWeightEl.textContent = "--";
      weightDiffEl.textContent = "Chưa ghi nhận";
      weightDiffEl.className = "stat-diff neutral";
      currentWaistEl.textContent = "--";
    }

    // Lấy dữ liệu tập trong tuần
    var workouts = LocalStore.get(LocalStore.KEYS.WORKOUTS, []);
    var weekWorkoutsCount = 0;
    var weekTotalMinutes = 0;
    var hasTrainedToday = false;

    workouts.forEach(function(w) {
      if (w.date === todayStr) {
        hasTrainedToday = true;
      }
      // Đơn giản tính 7 ngày gần nhất
      weekWorkoutsCount++;
      weekTotalMinutes += Math.round((Number(w.durationSeconds) || 1800) / 60);
    });

    var settings = LocalStore.get(LocalStore.KEYS.SETTINGS, { targetWorkoutsPerWeek: 4, calorieGoalDaily: 2000, targetWaistCm: 80 });
    document.getElementById("dashWorkoutsWeek").textContent = weekWorkoutsCount;
    document.getElementById("dashWorkoutMinutes").textContent = weekTotalMinutes + " phút tích lũy";
    document.getElementById("dashWaistTarget").textContent = "Mục tiêu: " + (settings.targetWaistCm || 80) + " cm";

    // Trạng thái buổi tập hôm nay
    var badgeToday = document.getElementById("dashWorkoutStatusBadge");
    var startBtn = document.getElementById("dashStartWorkoutBtn");
    if (hasTrainedToday) {
      badgeToday.style.display = "inline-block";
      startBtn.innerHTML = '<span>TẬP LẠI BUỔI TẬP HÔM NAY</span>';
    } else {
      badgeToday.style.display = "none";
      startBtn.innerHTML = '<svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>BẮT ĐẦU BUỔI TẬP NGAY</span>';
    }

    // Mini pills các động tác hôm nay
    var miniPreview = document.getElementById("dashMiniExerciseList");
    var pillsHtml = "";
    EXERCISE_DATABASE.slice(0, 5).forEach(function(ex) {
      pillsHtml += '<div class="mini-pill">' + escapeHtml(ex.nameVi) + '</div>';
    });
    miniPreview.innerHTML = pillsHtml;

    // Calo ăn hôm nay
    var foodLogs = LocalStore.get(LocalStore.KEYS.TODAY_FOODS, []);
    var todayCal = 0;
    foodLogs.forEach(function(item) {
      todayCal += (Number(item.totalCaloriesKcal) || 0);
    });
    document.getElementById("dashTodayCalories").textContent = Math.round(todayCal);
    document.getElementById("dashCalorieGoal").textContent = "Mục tiêu: " + (settings.calorieGoalDaily || 2000);
  },

  syncInitialDataFromBackend: async function() {
    if (!GAS_API_URL || GAS_API_URL.indexOf("Placeholder") !== -1) {
      return;
    }

    try {
      var data = await ApiService.get("getInitialData");
      if (data) {
        if (data.settings) LocalStore.set(LocalStore.KEYS.SETTINGS, data.settings);
        if (data.recentWorkouts) LocalStore.set(LocalStore.KEYS.WORKOUTS, data.recentWorkouts);
        if (data.recentWeights) LocalStore.set(LocalStore.KEYS.WEIGHTS, data.recentWeights);
        if (data.todayFoodLogs) LocalStore.set(LocalStore.KEYS.TODAY_FOODS, data.todayFoodLogs);
        this.refreshDashboard();
        if (appNav.currentTab === "progress") progressTracker.renderProgressView();
        if (appNav.currentTab === "nutrition") nutritionAI.renderNutritionView();
      }
    } catch (e) {
      // Backend đang chạy offline hoặc chưa kết nối, ứng dụng vẫn hoạt động trơn tru qua LocalStorage
    }
  }
};

// ==================== 13. TIỆN ÍCH CHỐNG XSS ====================
function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ==================== 14. KHỞI CHẠY ỨNG DỤNG ====================
document.addEventListener("DOMContentLoaded", function() {
  appNav.init();
  workoutEngine.init();
  nutritionAI.init();
  progressTracker.init();
  scheduleManager.init();
  appState.init();

  // Khởi tạo audio context khi người dùng chạm vào màn hình lần đầu
  document.addEventListener("touchstart", function() {
    SoundEffects.init();
  }, { once: true });
  document.addEventListener("click", function() {
    SoundEffects.init();
  }, { once: true });
});
