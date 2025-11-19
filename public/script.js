// Backend URL yapılandırması
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://yazipaylas-backendd.onrender.com';

console.log('🔌 Backend URL:', BACKEND_URL);
console.log('🌐 Hostname:', window.location.hostname);

const socket = io(BACKEND_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    timeout: 20000
});

const editor = document.getElementById('editor');
const statusEl = document.getElementById('status');
const userCountEl = document.getElementById('user-count');

let isUpdating = false;
let lastContent = '';

// Socket.IO bağlantı olayları
socket.on('connect', () => {
    console.log('✅ Socket bağlandı! ID:', socket.id);
    statusEl.textContent = 'Bağlandı';
    statusEl.classList.add('connected');
});

socket.on('disconnect', (reason) => {
    console.log('❌ Socket bağlantısı kesildi. Sebep:', reason);
    statusEl.textContent = 'Bağlantı kesildi - Yeniden bağlanılıyor...';
    statusEl.classList.remove('connected');
});

socket.on('connect_error', (error) => {
    console.error('❌ Bağlantı hatası:', error.message);
    statusEl.textContent = 'Bağlantı hatası - Tekrar deneniyor...';
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Yeniden bağlanıldı! Deneme:', attemptNumber);
});

socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Yeniden bağlanma denemesi:', attemptNumber);
});

// Belgeyi yükle
socket.on('load-document', (data) => {
    console.log('📄 Belge yüklendi, içerik uzunluğu:', data.content.length);
    isUpdating = true;
    editor.innerHTML = data.content;
    lastContent = data.content;
    setTimeout(() => { isUpdating = false; }, 100);
});

// İçerik güncellemesi
socket.on('content-update', (data) => {
    console.log('📝 İçerik güncellendi, uzunluk:', data.content.length);
    if (!isUpdating && data.content !== lastContent) {
        isUpdating = true;
        const selection = saveSelection();
        editor.innerHTML = data.content;
        lastContent = data.content;
        restoreSelection(selection);
        setTimeout(() => { isUpdating = false; }, 100);
    }
});

// Kullanıcı sayısı
socket.on('user-count', (count) => {
    console.log('👥 Aktif kullanıcı sayısı:', count);
    userCountEl.textContent = `Aktif Kullanıcı: ${count}`;
});

// İçerik değişikliğini algıla ve gönder
let typingTimer;
const typingDelay = 300; // 300ms debounce

editor.addEventListener('input', () => {
    if (!isUpdating) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            const content = editor.innerHTML;
            if (content !== lastContent) {
                console.log('📤 İçerik gönderiliyor, uzunluk:', content.length);
                lastContent = content;
                socket.emit('content-change', {
                    content: content
                });
            }
        }, typingDelay);
    }
});

// Görsel yapıştırma
editor.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            e.preventDefault();
            console.log('🖼️ Görsel yapıştırılıyor...');
            const blob = item.getAsFile();
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Yapıştırılan görsel';
                
                // Seçili konuma ekle
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(img);
                    
                    // İmleci görselin sonrasına taşı
                    range.setStartAfter(img);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    editor.appendChild(img);
                }
                
                // İçerik güncellemesini hemen gönder
                setTimeout(() => {
                    const content = editor.innerHTML;
                    console.log('📤 Görsel ile içerik gönderiliyor');
                    lastContent = content;
                    socket.emit('content-change', {
                        content: content
                    });
                }, 100);
            };
            
            reader.readAsDataURL(blob);
        }
    }
});

// Toolbar butonları
document.getElementById('bold-btn').addEventListener('click', () => {
    document.execCommand('bold');
    editor.focus();
});

document.getElementById('italic-btn').addEventListener('click', () => {
    document.execCommand('italic');
    editor.focus();
});

document.getElementById('underline-btn').addEventListener('click', () => {
    document.execCommand('underline');
    editor.focus();
});

document.getElementById('left-align').addEventListener('click', () => {
    document.execCommand('justifyLeft');
    editor.focus();
});

document.getElementById('center-align').addEventListener('click', () => {
    document.execCommand('justifyCenter');
    editor.focus();
});

document.getElementById('right-align').addEventListener('click', () => {
    document.execCommand('justifyRight');
    editor.focus();
});

document.getElementById('font-size').addEventListener('change', (e) => {
    document.execCommand('fontSize', false, '7');
    const fontElements = editor.querySelectorAll('font[size="7"]');
    fontElements.forEach(el => {
        el.removeAttribute('size');
        el.style.fontSize = e.target.value + 'px';
    });
    editor.focus();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Tüm içeriği temizlemek istediğinizden emin misiniz?')) {
        editor.innerHTML = '';
        socket.emit('content-change', {
            content: ''
        });
    }
});

// Klavye kısayolları
editor.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                document.execCommand('bold');
                break;
            case 'i':
                e.preventDefault();
                document.execCommand('italic');
                break;
            case 'u':
                e.preventDefault();
                document.execCommand('underline');
                break;
        }
    }
});

// Seçimi kaydet ve geri yükle (cursor pozisyonu için)
function saveSelection() {
    if (window.getSelection) {
        const sel = window.getSelection();
        if (sel.getRangeCount > 0) {
            return sel.getRangeAt(0);
        }
    }
    return null;
}

function restoreSelection(range) {
    if (range && window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// Editörü odakla
editor.focus();
