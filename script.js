// === State ===
let compressedBase64 = null;
let checklistData = null;

// === Safety Guidelines (built-in) ===
const SAFETY_GUIDELINES = `
[기본 안전점검 항목]
1. 개인보호구: 안전모, 안전화, 안전조끼 착용 여부
2. 추락방지: 안전난간, 안전망, 개구부 덮개 설치 여부
3. 중장비: 작업구역 통제, 신호수 배치, 장비 점검 여부
4. 가설구조물: 비계, 거푸집, 동바리 설치 상태
5. 전기안전: 누전차단기, 접지, 배선 상태
6. 굴착작업: 토사붕괴 방지, 흙막이, 지하매설물 확인
7. 작업환경: 정리정돈, 통로 확보, 조명 상태
8. 안전표지: 위험표지, 경고표지, 안내표지 설치 여부
9. 안전교육: 작업 전 안전교육(TBM) 실시 여부
10. 화재예방: 소화기 비치, 용접작업 시 방화조치 여부
11. 밀폐공간: 환기설비, 가스측정, 감시인 배치 여부
12. 양중작업: 와이어로프 상태, 과부하 방지, 신호체계 여부
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
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) { showToast('API Key를 입력해주세요', true); return; }
  if (!compressedBase64) { showToast('사진을 먼저 업로드해주세요', true); return; }

  setLoading(true);

  const prompt = `당신은 건설현장 안전점검 전문가입니다.
첨부된 현장 사진을 분석하고, 아래 안전 지침 데이터를 참고하여 안전점검 체크리스트를 JSON 형식으로 생성하세요.

${SAFETY_GUIDELINES}

[규칙]
- 사진에서 관찰되는 상황과 안전 지침을 결합하여 10~15개 항목 생성
- 각 항목에 위험도를 판단: "위험", "주의", "양호" 중 택1
- 사진에서 보이는 구체적 상황을 반영할 것

[출력 형식 - 반드시 JSON만 출력, 다른 텍스트 없이]
{
  "site_summary": "현장 요약 (1문장)",
  "groups": [
    {
      "title": "카테고리명",
      "items": [
        { "text": "점검 항목 내용", "level": "위험|주의|양호" }
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

  // Create a full-screen visible overlay (mobile Safari needs visible elements)
  const overlay = document.createElement('div');
  overlay.id = 'pdfOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:#fff;overflow:auto;';

  const container = document.createElement('div');
  container.style.cssText = 'width:100%;max-width:680px;margin:0 auto;padding:32px 28px;font-family:"Noto Sans KR",sans-serif;color:#1a1d23;background:#fff;line-height:1.6;';

  let html = `<h1 style="font-size:18px;text-align:center;margin:0 0 4px;font-weight:800;">현장 안전점검 체크리스트</h1>`;
  html += `<p style="text-align:center;font-size:10px;color:#888;margin:0 0 8px;">${resultMeta.textContent}</p>`;
  if (checklistData.site_summary) {
    html += `<p style="font-size:11px;color:#555;margin:0 0 10px;">📍 ${checklistData.site_summary}</p>`;
  }
  html += `<hr style="border:none;border-top:1px solid #ddd;margin:0 0 14px;">`;

  (checklistData.groups || []).forEach(group => {
    html += `<div style="margin-bottom:14px;">`;
    html += `<div style="font-size:12px;font-weight:700;padding-bottom:4px;border-bottom:1px solid #eee;margin-bottom:6px;">${group.title}</div>`;
    (group.items || []).forEach(item => {
      const color = item.level === '위험' ? '#d92b2b' : item.level === '주의' ? '#e08a00' : '#0a8a3d';
      const bg = item.level === '위험' ? '#fde8e8' : item.level === '주의' ? '#fef3e0' : '#e4f5eb';
      html += `<div style="padding:4px 0;font-size:11px;">
        <span>☐ </span>
        <span>${item.text}</span>
        <span style="font-size:9px;font-weight:600;padding:1px 6px;border-radius:4px;background:${bg};color:${color};margin-left:4px;">${item.level}</span>
      </div>`;
    });
    html += `</div>`;
  });

  html += `<p style="text-align:center;font-size:7px;color:#bbb;margin-top:20px;">AI 안전점검 체크리스트 시스템</p>`;
  container.innerHTML = html;
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Wait for fonts + rendering
  try { await document.fonts.ready; } catch(e) {}
  await new Promise(r => setTimeout(r, 500));

  const filename = `safety_checklist_${new Date().toISOString().slice(0,10)}.pdf`;

  try {
    await html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, windowWidth: 680 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(container).save();
    showToast('PDF 다운로드 완료');
  } catch(e) {
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

// === API Toggle ===
function toggleApiKey() {
  const input = document.getElementById('apiKeyInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}
