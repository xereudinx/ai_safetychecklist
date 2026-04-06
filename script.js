// === State ===
let compressedBase64 = null;
let checklistData = null;

// === Safety Guidelines (built-in) ===
const SAFETY_GUIDELINES = `
[A. 산업안전보건기준에 관한 규칙 (고용노동부령 제450호)]

1. 작업장 안전 (제3~30조)
 - 통로 확보: 작업장 통로 폭 1.2m 이상 유지, 장애물 제거 (제3조)
 - 조명: 작업면 조도 확보 (일반작업 150lux 이상, 정밀작업 300lux 이상) (제8조)
 - 정리정돈: 작업장 바닥 및 통로 정리정돈 상태 (제10조)

2. 개인보호구 (제31~34조)
 - 안전모: 물체 낙하·비래 위험 작업 시 착용 (제31조)
 - 안전화: 중량물 취급, 추락위험 작업 시 착용 (제32조)
 - 안전대: 높이 2m 이상 추락위험 장소에서 착용 (제33조)
 - 보호구 지급·관리: 보호구 상태 점검 및 교체 (제34조)

3. 추락방지 (제42~48조)
 - 안전난간: 높이 2m 이상 개구부, 작업발판 끝에 설치 (제42조) / 높이 90cm 이상, 중간대 설치
 - 추락방호망: 안전난간 설치 곤란 시 설치 (제43조)
 - 개구부 덮개: 바닥 개구부에 견고한 덮개 설치 (제44조)
 - 안전대 부착설비: 안전대 걸이용 구조물 설치 (제45조)

4. 비계 (제54~66조)
 - 강관비계: 수직·수평재 연결 상태, 벽이음 간격 확인 (제55조)
 - 작업발판: 폭 40cm 이상, 틈새 3cm 이하, 고정 상태 (제56조)
 - 시스템비계: 수직재·수평재·가새재 연결부 체결 상태 (제58조)

5. 거푸집·동바리 (제330~339조)
 - 거푸집 조립 시 콘크리트 측압 고려한 지보공 설치 (제331조)
 - 동바리 수직도, 연결부 체결 상태, 침하 방지 조치 (제332조)
 - 콘크리트 타설 시 편압 방지, 타설 속도 관리 (제334조)

6. 건설기계 (제171~221조)
 - 유도자·신호수 배치: 건설기계 작업 시 유도자 배치 (제171조)
 - 접촉 방지: 작업반경 내 근로자 출입금지 조치 (제174조)
 - 전도 방지: 지반 침하 방지, 아웃리거 설치 (제175조)
 - 작업계획서: 건설기계 작업 전 작업계획서 작성 (제171조)

7. 굴착작업 (제338~350조)
 - 토사붕괴 방지: 흙막이 지보공 설치 (제339조)
 - 지하매설물: 굴착 전 매설물 확인, 이설·보호조치 (제340조)
 - 경사면 기울기 준수: 지질에 따른 굴착면 기울기 확인 (제341조)
 - 굴착기계 작업반경 내 출입금지 (제342조)

8. 전기안전 (제301~337조)
 - 누전차단기: 이동형 전기기계·기구에 설치 (제304조)
 - 접지: 전기기계·기구 외함 접지 (제305조)
 - 감전방지: 충전부 절연 또는 격리 (제301조)
 - 가공전선 근접작업: 이격거리 확보 또는 방호관 설치 (제322조)

9. 화재·폭발 예방 (제225~280조)
 - 소화기: 작업장 내 소화기 비치 (제225조)
 - 용접작업: 불꽃 비산 방지 조치, 소화기 비치, 화재감시인 배치 (제241조)
 - 위험물 저장: 위험물 종류별 적정 보관 (제230조)

10. 밀폐공간 (제618~628조)
 - 산소농도 측정: 작업 전 산소농도 18% 이상 확인 (제619조)
 - 환기: 적정 공기 유지를 위한 환기설비 가동 (제620조)
 - 감시인: 밀폐공간 외부에 감시인 배치 (제621조)

11. 양중작업
 - 와이어로프: 꼬임·마모·절단 점검 (제163조)
 - 과부하 방지: 정격하중 초과 금지, 과부하방지장치 (제166조)
 - 신호체계: 일정한 신호방법 정하여 운용 (제164조)

[B. 건설기계 안전기준에 관한 규칙]

1. 굴착기: 붐·암·버킷 연결핀 및 유압호스 상태 점검
2. 크레인: 안전밸브, 과부하방지장치, 권과방지장치 작동 확인
3. 지게차: 포크 균열, 마스트 체인, 후방경보기, 헤드가드
4. 고소작업차: 작업대 안전난간, 과부하경보, 아웃리거 설치

[C. 안전보건관리규정 (한국농어촌공사, 2026.01.01 개정)]

1. 위험성평가 실시: 사업주가 유해위험요인 파악 및 위험성 수준 결정 (제3조)
2. 안전보건교육: TBM(Tool Box Meeting) 실시 여부, 신규채용 교육
3. 산업재해 보고: 재해 발생 시 즉시 보고 및 기록 유지
4. 관계수급인 안전관리: 하도급 근로자 포함 안전관리 적용
5. 안전보건 점검: 정기점검, 수시점검, 특별점검 구분 실시

[D. 건설공사안전관리지침 (2025.01.01 전부개정)]

1. 안전관리계획서: 공사착공 전 안전관리계획서 수립·제출
2. 안전점검 종류: 정기안전점검, 정밀안전점검, 초기점검 구분
3. 시공 중 안전관리: 공종별 위험요소 사전파악, 작업 전 안전조치
4. 가설구조물 점검: 비계·거푸집·동바리 등 설치 전후 점검
5. 건설기계 안전: 작업계획서 작성, 유자격 운전원, 정기점검
6. 위험작업 허가제: 밀폐공간, 화기, 중장비, 고소작업 시 작업허가서 발행
7. 안전관리비 사용: 안전시설, 보호구, 교육 등에 적정 집행
`;

// === Elements ===
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadZone = document.getElementById('uploadZone');
const fileInfo = document.getElementById('fileInfo');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const analyzeSpinner = document.getElementById('analyzeSpinner');
const resultSection = document.getElementById('resultSection');
const checklistArea = document.getElementById('checklistArea');
const resultMeta = document.getElementById('resultMeta');

// === File Input ===
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('이미지 파일만 업로드 가능합니다', true);
    return;
  }
  try {
    const compressed = await compressImage(file, 2048, 0.7);
    compressedBase64 = compressed.base64;
    preview.src = 'data:image/jpeg;base64,' + compressedBase64;
    preview.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
    uploadZone.classList.add('has-image');
    const sizeKB = Math.round(compressed.sizeBytes / 1024);
    fileInfo.style.display = 'flex';
    fileInfo.innerHTML = `<span>📷 ${file.name}</span><span>${sizeKB} KB</span>`;
    analyzeBtn.disabled = false;
    resultSection.style.display = 'none';
  } catch (err) {
    showToast('이미지 처리 중 오류가 발생했습니다', true);
  }
});

// === Image Compression ===
function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];
        const sizeBytes = Math.round(base64.length * 3 / 4);
        resolve({ base64, sizeBytes });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// === Analysis ===
async function startAnalysis() {
  const apiKey = localStorage.getItem('claude_api_key') || document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) { showToast('API Key를 입력해주세요', true); return; }
  if (!compressedBase64) { showToast('사진을 먼저 업로드해주세요', true); return; }

  setLoading(true);

  const workType = document.getElementById('workTypeSelect').value;
  const workTypeLine = workType ? `\n[현장 공종: ${workType}]\n이 공종의 법정 필수 점검항목을 반드시 포함하세요.\n` : '';

  const prompt = `당신은 건설현장 안전점검 전문가입니다.
업로드된 현장 사진을 분석하고, 아래 산업안전 및 건설 안전 지침을 근거로 현장 안전점검 체크리스트를 작성하세요.
각 항목은 실제 현장에서 사용할 수 있는 점검 항목 형태로 작성하고, 근거 법령 조항을 함께 표시하세요.
${workTypeLine}
${SAFETY_GUIDELINES}

[규칙]
- 사진에서 관찰되는 상황과 안전 지침을 결합하여 10~15개 항목 생성
- 각 항목에 위험도를 판단: "위험", "주의", "양호" 중 택1
- 사진에서 보이는 구체적 상황을 반영할 것
- 각 항목에 근거 조항 번호를 포함할 것 (예: 제42조)

[출력 형식 - 반드시 JSON만 출력, 다른 텍스트 없이]
{
  "site_summary": "현장 요약 (1문장)",
  "groups": [
    {
      "title": "카테고리명",
      "items": [
        { "text": "점검 항목 내용 (근거: 제XX조)", "level": "위험|주의|양호" }
      ]
    }
  ]
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: compressedBase64 } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API 오류 (${res.status})`);
    }

    const data = await res.json();
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    checklistData = JSON.parse(clean);
    renderChecklist(checklistData);
  } catch (err) {
    showToast(err.message || 'AI 분석 중 오류가 발생했습니다', true);
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  analyzeBtn.disabled = on;
  analyzeBtnText.textContent = on ? 'AI 분석 중...' : 'AI 분석 시작';
  analyzeSpinner.style.display = on ? 'block' : 'none';
}

// === Render ===
function renderChecklist(data) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  resultMeta.textContent = dateStr;

  let html = '';
  if (data.site_summary) {
    html += `<p style="font-size:13px;color:var(--text2);margin-bottom:14px;line-height:1.5">📍 ${data.site_summary}</p>`;
  }

  (data.groups || []).forEach(group => {
    html += `<div class="checklist-group">`;
    html += `<div class="checklist-group-title">${group.title}</div>`;
    (group.items || []).forEach(item => {
      const tagClass = item.level === '위험' ? 'tag-danger' : item.level === '주의' ? 'tag-warn' : 'tag-safe';
      html += `
        <div class="checklist-item">
          <input type="checkbox">
          <div class="checklist-content">
            <div class="checklist-text">${item.text}</div>
            <span class="checklist-tag ${tagClass}">${item.level}</span>
          </div>
        </div>`;
    });
    html += `</div>`;
  });

  checklistArea.innerHTML = html;
  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === PDF ===
async function downloadPDF() {
  if (!checklistData) return;
  showToast('PDF 생성 중...');

  // Create visible overlay for html2canvas (mobile Safari requires visible elements)
  const overlay = document.createElement('div');
  overlay.id = 'pdfOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:#fff;overflow:auto;';

  const container = document.createElement('div');
  container.style.cssText = 'width:680px;margin:0 auto;padding:30px 36px;font-family:"Noto Sans KR",sans-serif;color:#1a1d23;background:#fff;line-height:1.6;';

  // Title
  let html = `<h1 style="font-size:17px;text-align:center;margin:0 0 2px;font-weight:800;">현장 안전점검 체크리스트</h1>`;
  html += `<p style="text-align:center;font-size:9px;color:#888;margin:0 0 12px;">${resultMeta.textContent}</p>`;

  // Photo thumbnail
  if (compressedBase64) {
    html += `<div style="text-align:center;margin-bottom:12px;">`;
    html += `<img src="data:image/jpeg;base64,${compressedBase64}" style="max-width:280px;max-height:180px;border-radius:6px;border:1px solid #ddd;">`;
    html += `</div>`;
  }

  // Summary
  if (checklistData.site_summary) {
    html += `<div style="background:#f8f9fa;padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:11px;color:#333;">📍 ${checklistData.site_summary}</div>`;
  }

  html += `<hr style="border:none;border-top:1px solid #ddd;margin:0 0 12px;">`;

  // Checklist groups
  (checklistData.groups || []).forEach(group => {
    html += `<div style="margin-bottom:12px;">`;
    html += `<div style="font-size:11px;font-weight:700;padding-bottom:3px;border-bottom:1px solid #eee;margin-bottom:5px;">${group.title}</div>`;
    (group.items || []).forEach(item => {
      const color = item.level === '위험' ? '#d92b2b' : item.level === '주의' ? '#e08a00' : '#0a8a3d';
      const bg = item.level === '위험' ? '#fde8e8' : item.level === '주의' ? '#fef3e0' : '#e4f5eb';
      html += `<div style="padding:3px 0;font-size:10px;line-height:1.5;">`;
      html += `<span>☐ </span>`;
      html += `<span>${item.text}</span>`;
      html += `<span style="font-size:8px;font-weight:600;padding:1px 5px;border-radius:3px;background:${bg};color:${color};margin-left:3px;">${item.level}</span>`;
      html += `</div>`;
    });
    html += `</div>`;
  });

  html += `<p style="text-align:center;font-size:7px;color:#bbb;margin-top:16px;">AI 안전점검 체크리스트 시스템</p>`;

  container.innerHTML = html;
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Wait for image + fonts to render
  try { await document.fonts.ready; } catch(e) {}
  await new Promise(r => setTimeout(r, 600));

  try {
    // Capture with html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      windowWidth: 680,
      backgroundColor: '#ffffff'
    });

    // Create PDF with jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const contentWidth = pageWidth - margin * 2;

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgRatio = canvas.height / canvas.width;
    const imgHeight = contentWidth * imgRatio;

    if (imgHeight <= pageHeight - margin * 2) {
      // Fits on one page
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight);
    } else {
      // Multi-page: slice the canvas
      const pxPerPage = canvas.width * ((pageHeight - margin * 2) / contentWidth);
      let srcY = 0;
      let page = 0;
      while (srcY < canvas.height) {
        if (page > 0) pdf.addPage();
        const sliceH = Math.min(pxPerPage, canvas.height - srcY);

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92);
        const sliceRenderH = contentWidth * (sliceH / canvas.width);
        pdf.addImage(sliceData, 'JPEG', margin, margin, contentWidth, sliceRenderH);

        srcY += sliceH;
        page++;
      }
    }

    // Blob-based download (mobile Safari compatible)
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const filename = '현장_안전점검_보고서.pdf';

    // Try <a> download first (works on most browsers)
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fallback: if Safari ignores download attr, open in new tab
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      setTimeout(() => { window.open(url, '_blank'); }, 100);
    } else {
      setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
    }

    showToast('PDF 다운로드 완료');
  } catch(e) {
    console.error('PDF error:', e);
    showToast('PDF 생성 중 오류가 발생했습니다', true);
  } finally {
    document.body.removeChild(overlay);
  }
}

// === Toast ===
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// === API Key Management ===
function toggleApiKey() {
  const input = document.getElementById('apiKeyInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { showToast('API Key를 입력해주세요', true); return; }
  try {
    localStorage.setItem('claude_api_key', key);
    showSavedState();
    showToast('API Key가 저장되었습니다');
  } catch(e) {
    showToast('저장 실패: 브라우저 설정을 확인하세요', true);
  }
}

function changeApiKey() {
  localStorage.removeItem('claude_api_key');
  document.getElementById('apiKeyInput').value = '';
  document.getElementById('apiInputRow').style.display = 'flex';
  document.getElementById('apiSavedRow').style.display = 'none';
  document.getElementById('apiKeyInput').focus();
}

function showSavedState() {
  document.getElementById('apiInputRow').style.display = 'none';
  document.getElementById('apiSavedRow').style.display = 'flex';
}

// On page load: restore saved API key
document.addEventListener('DOMContentLoaded', function() {
  try {
    const saved = localStorage.getItem('claude_api_key');
    if (saved) showSavedState();
  } catch(e) {}
});
