// AgriAtlas PWA - 황소작목반 신철진
// Plant.id API 연동

// ZPUddYz6Y7axRTUK6QHkD5Lhe6Bkya2bEI0jfeOPSP9xgY32ou
const PLANT_ID_API_KEY = ZPUddYz6Y7axRTUK6QHkD5Lhe6Bkya2bEI0jfeOPSP9xgY32ou

let selectedImage = null;

// Service Worker 등록
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// 이미지 선택 핸들러
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    selectedImage = file;
    const preview = document.getElementById('preview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        analyzeBtn.style.display = 'block';
        document.getElementById('result').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

// AI 진단 버튼 클릭
document.getElementById('analyzeBtn').addEventListener('click', async function() {
    if (!selectedImage) return;

    // API 키 확인
    if (PLANT_ID_API_KEY === '') {
        alert('?? Plant.id API 키를 설정해주세요!\\n\\napp.js 파일의 PLANT_ID_API_KEY 변수에 발급받은 키를 입력하세요.');
        return;
    }

    // 로딩 표시
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    this.disabled = true;

    try {
        // 이미지를 Base64로 변환
        const base64 = await fileToBase64(selectedImage);
        
        // Plant.id API 호출
        const result = await identifyPlant(base64);
        
        // 결과 표시
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('? 분석 중 오류가 발생했습니다.\\n\\n' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
        this.disabled = false;
    }
});

// 파일을 Base64로 변환
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Plant.id API 호출
async function identifyPlant(base64Image) {
    const response = await fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': PLANT_ID_API_KEY
        },
        body: JSON.stringify({
            images: [base64Image],
            modifiers: ['crops_fast', 'similar_images'],
            plant_language: 'ko',
            plant_details: [
                'common_names',
                'taxonomy',
                'description',
                'edible_parts',
                'watering'
            ]
        })
    });

    if (!response.ok) {
        throw new Error('API 호출 실패: ' + response.status);
    }

    return await response.json();
}

// 결과 표시
function displayResult(data) {
    const resultDiv = document.getElementById('result');
    
    if (!data.suggestions || data.suggestions.length === 0) {
        resultDiv.innerHTML = '<h3>? 작물을 식별할 수 없습니다</h3><p>다른 사진으로 시도해보세요.</p>';
        resultDiv.style.display = 'block';
        return;
    }

    let html = '<h3>?? AI 진단 결과</h3>';
    
    // 상위 3개 결과만 표시
    data.suggestions.slice(0, 3).forEach((suggestion, index) => {
        const probability = (suggestion.probability * 100).toFixed(1);
        const plantName = suggestion.plant_name || '알 수 없음';
        const details = suggestion.plant_details || {};
        
        html += 
            <div class="result-item">
                <h4>\. \</h4>
                <span class="probability">신뢰도: \%</span>
        ;
        
        if (details.common_names && details.common_names.length > 0) {
            html += <p><strong>일반 이름:</strong> \</p>;
        }
        
        if (details.description && details.description.value) {
            const desc = details.description.value.substring(0, 200);
            html += <p>\...</p>;
        }
        
        if (details.edible_parts && details.edible_parts.length > 0) {
            html += <p><strong>식용 부위:</strong> \</p>;
        }
        
        html += '</div>';
    });
    
    html += '<p style="text-align:center;margin-top:15px;color:#666;">?? 황소작목반 신철진 - Plant.id AI 제공</p>';
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

console.log('?? 황소작목반 신철진 - AgriAtlas PWA');
