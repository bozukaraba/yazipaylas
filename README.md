# 📝 Yazı Paylaş

Gerçek zamanlı işbirlikçi belge düzenleme uygulaması. Birden fazla kullanıcı aynı anda aynı belge üzerinde çalışabilir.

## ✨ Özellikler

- 🔄 Gerçek zamanlı senkronizasyon
- 👥 Çoklu kullanıcı desteği
- 🖼️ Screenshot yapıştırma (Ctrl+V)
- 📝 Word benzeri arayüz
- ✏️ Metin biçimlendirme (Kalın, İtalik, Altı Çizili)
- 📏 Metin hizalama (Sol, Orta, Sağ)
- 🔤 Font boyutu ayarlama
- 🎨 Modern ve kullanıcı dostu tasarım

## 🚀 Kurulum

```bash
npm install
```

## 🎯 Yerel Kullanım

```bash
npm start
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🌐 Netlify'a Deploy Etme

### 1. Backend'i Render.com'a Deploy Edin

1. [Render.com](https://render.com) hesabı oluşturun
2. "New +" butonuna tıklayın ve "Web Service" seçin
3. GitHub reposunu bağlayın
4. Aşağıdaki ayarları yapın:
   - **Name**: `yazipaylas-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. "Create Web Service" butonuna tıklayın
6. Deploy tamamlandıktan sonra URL'yi kopyalayın (örn: `https://yazipaylas-backend.onrender.com`)

### 2. Frontend'i Netlify'a Deploy Edin

#### Option A: Netlify Web Arayüzü ile

1. [Netlify](https://netlify.com) hesabı oluşturun
2. "Add new site" > "Import an existing project" seçin
3. GitHub reposunu bağlayın
4. Aşağıdaki ayarları yapın:
   - **Build command**: Boş bırakın
   - **Publish directory**: `public`
5. "Deploy site" butonuna tıklayın

#### Option B: Netlify CLI ile

```bash
# Netlify CLI ile giriş yapın
npx netlify login

# Yeni site oluşturun
npx netlify init

# Deploy edin
npx netlify deploy --prod
```

### 3. Backend URL'sini Güncelleyin

`public/script.js` dosyasındaki `BACKEND_URL` değişkenini Render.com'dan aldığınız URL ile güncelleyin:

```javascript
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://YOUR-APP-NAME.onrender.com';
```

Değişikliği commit edip tekrar push edin:

```bash
git add .
git commit -m "Backend URL güncellendi"
git push origin main
```

## 🔧 Teknolojiler

- Node.js
- Express.js
- Socket.IO
- HTML5
- CSS3
- JavaScript (ES6+)

## 📱 Nasıl Kullanılır?

1. Uygulamayı başlatın
2. Farklı tarayıcılar veya bilgisayarlardan aynı adrese bağlanın
3. Yazmaya başlayın - değişiklikler anında senkronize edilir
4. Screenshot almak için ekran görüntüsü alın ve Ctrl+V ile yapıştırın

## 🏗️ Proje Yapısı

```
yazipaylas/
├── server.js              # Node.js backend sunucusu
├── package.json           # Bağımlılıklar
├── netlify.toml          # Netlify yapılandırması
├── render.yaml           # Render.com yapılandırması
└── public/
    ├── index.html        # Ana sayfa
    ├── style.css         # Stil dosyası
    ├── script.js         # İstemci tarafı JavaScript
    └── _redirects        # Netlify yönlendirmeleri
```

## 🔒 CORS Ayarları

Backend üzerinde tüm originlere izin verilmiştir. Production ortamında bunu kısıtlamak isteyebilirsiniz:

```javascript
const io = socketIo(server, {
  cors: {
    origin: "https://your-netlify-app.netlify.app",
    methods: ["GET", "POST"]
  }
});
```

## 📄 Lisans

ISC
