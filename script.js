// 크리스마스 트리 애니메이션
// 색상 변경 및 토글 스위치 애니메이션

const COLORS = ["#c0392b", "#f8f9fa", "#d68910", "#0e6655", "#27ae60"];
const TOGGLE_CIRCLE_SIZE = 30;
const ANIMATION_INTERVAL = 1000;

// DOM 로드 확인
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const toggles = document.querySelectorAll(".toggle-switch");
  const circles = document.querySelectorAll(".circle");
  
  // 요소 확인
  if (toggles.length === 0 || circles.length === 0) {
    console.error('애니메이션 요소를 찾을 수 없습니다.');
    return;
  }
  
  setupAnimation(toggles, circles);
}

function setupAnimation(toggles, circles) {

  let counter = 0;
  let animationId = null;

  // Store color pairs for each element
  const circleColors = new Map();
  const toggleBackgroundColors = new Map();
  const toggleCircleColors = new Map();

  const getTwoRandomColors = () => {
    const first = Math.floor(Math.random() * COLORS.length);
    let second = Math.floor(Math.random() * COLORS.length);

    while (second === first) {
      second = Math.floor(Math.random() * COLORS.length);
    }

    return [COLORS[first], COLORS[second]];
  };

  const getUniqueColorPairs = () => {
    const pair1 = getTwoRandomColors();
    let pair2 = getTwoRandomColors();
    let attempts = 0;
    const maxAttempts = 100;

    // Ensure pair2 doesn't share any colors with pair1
    while ((pair2.includes(pair1[0]) || pair2.includes(pair1[1])) && attempts < maxAttempts) {
      pair2 = getTwoRandomColors();
      attempts++;
    }

    return [pair1, pair2];
  };

  // Initialize colors for each circle element
  circles.forEach((circle) => {
    circleColors.set(circle, getTwoRandomColors());
  });

  toggles.forEach((toggle) => {
    const [bgColors, circleColors] = getUniqueColorPairs();
    toggleBackgroundColors.set(toggle, bgColors);
    const toggleCircle = toggle.querySelector(".toggle-circle");
    if (toggleCircle) {
      toggleCircleColors.set(toggleCircle, circleColors);
    }
  });

  const animateToggles = () => {
    toggles.forEach((toggle) => {
      const toggleCircle = toggle.querySelector(".toggle-circle");
      if (!toggleCircle) return;
      
      const size = parseInt(toggle.dataset.size) || 70;
      const isLarge = toggle.classList.contains("toggle-switch-l");
      // Changing direction of L toggles to make it visually more interesting
      const shouldToggle = isLarge ? counter % 2 === 0 : counter % 2 !== 0;

      const translateX = shouldToggle ? size - TOGGLE_CIRCLE_SIZE : 0;
      const bgColors = toggleBackgroundColors.get(toggle);
      const circleColors = toggleCircleColors.get(toggleCircle);
      
      if (!bgColors || !circleColors) return;
      
      const bgColorIdx = shouldToggle ? 1 : 0;
      const circleColorIdx = counter % 2;

      toggle.style.backgroundColor = bgColors[bgColorIdx];
      toggleCircle.style.transform = `translateX(${translateX}px)`;
      toggleCircle.style.backgroundColor = circleColors[circleColorIdx];
    });
  };

  const animateCircles = () => {
    circles.forEach((circle) => {
      const colors = circleColors.get(circle);
      if (!colors) return;
      
      const colorIdx = counter % 2;
      circle.style.backgroundColor = colors[colorIdx];
    });
  };

  const animate = () => {
    counter++;
    animateToggles();
    animateCircles();
  };

  // Initial animation
  animate();

  // Start interval
  animationId = setInterval(animate, ANIMATION_INTERVAL);
  
  // 페이지 언로드 시 정리
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      clearInterval(animationId);
    }
  });
  
  // 탭이 보이지 않을 때 애니메이션 일시 중지 (성능 최적화)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) {
        clearInterval(animationId);
        animationId = null;
      }
    } else {
      if (!animationId) {
        animationId = setInterval(animate, ANIMATION_INTERVAL);
      }
    }
  });
}
