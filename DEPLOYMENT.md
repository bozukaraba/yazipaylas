# 🚀 Deployment Rehberi

Bu rehber, Yazı Paylaş uygulamasını Netlify ve Render.com üzerinde nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Gereksinimler

- GitHub hesabı
- Netlify hesabı (ücretsiz)
- Render.com hesabı (ücretsiz)

## 🎯 Adım Adım Deploy

### 1️⃣ Backend Deploy (Render.com)

Backend Socket.IO kullandığı için Render.com üzerinde barındırılmalıdır.

1. **Render.com'a gidin**: https://render.com
2. **Sign Up / Login** yapın
3. **Dashboard'dan "New +"** butonuna tıklayın
4. **"Web Service"** seçin
5. **GitHub repo bağlayın**:
   - "Connect a repository" seçin
   - `bozukaraba/yazipaylas` reposunu seçin
6. **Ayarları yapın**:
   ```
   Name: yazipaylas-backend
   Region: Frankfurt (veya en yakın)
   Branch: main
   Root Directory: (boş bırakın)
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```
7. **"Create Web Service"** butonuna tıklayın
8. **Deploy tamamlanınca** URL'yi kopyalayın (örn: `https://yazipaylas-backend.onrender.com`)

### 2️⃣ Frontend Deploy (Netlify)

Frontend statik dosyalar olduğu için Netlify'da barındırılır.

#### Netlify Web Arayüzü ile:

1. **Netlify'a gidin**: https://app.netlify.com
2. **Sign Up / Login** yapın
3. **"Add new site"** > **"Import an existing project"**
4. **GitHub'ı seçin** ve repo bağlayın
5. **Ayarları yapın**:
   ```
   Branch to deploy: main
   Build command: (boş bırakın)
   Publish directory: public
   ```
6. **"Deploy site"** butonuna tıklayın
7. Site URL'nizi alın (örn: `https://random-name.netlify.app`)

#### Netlify CLI ile:

```bash
# CLI ile login
npx netlify login

# Site oluştur
npx netlify init

# Deploy et
npx netlify deploy --prod --dir=public
```

### 3️⃣ Backend URL'sini Güncelleme

Frontend'in backend ile konuşabilmesi için URL'yi güncellemeniz gerekiyor:

1. **`public/script.js` dosyasını açın**
2. **`BACKEND_URL` değişkenini güncelleyin**:
   ```javascript
   const BACKEND_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3001' 
       : 'https://yazipaylas-backend.onrender.com'; // Kendi URL'nizi yazın
   ```
3. **Değişiklikleri commit edin**:
   ```bash
   git add public/script.js
   git commit -m "Backend URL güncellendi"
   git push origin main
   ```

Netlify otomatik olarak yeni deploy başlatacaktır!

### 4️⃣ CORS Güvenlik Ayarı (Opsiyonel)

Production'da güvenlik için CORS'u kısıtlayabilirsiniz:

**`server.js` dosyasında**:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "https://your-app.netlify.app", // Netlify URL'nizi yazın
    methods: ["GET", "POST"]
  }
});
```

## ✅ Test Etme

1. Netlify URL'nizi tarayıcıda açın
2. Başka bir tarayıcı/cihazda aynı URL'yi açın
3. Bir tarafta yazın - diğer tarafta görünmeli
4. Screenshot yapıştırmayı deneyin

## 🔧 Sorun Giderme

### "Bağlantı kesildi" hatası alıyorum

- Backend URL'sinin doğru olduğundan emin olun
- Render.com servisinizin çalıştığını kontrol edin
- Tarayıcı konsolunu açıp hata mesajlarını inceleyin

### Render.com ücretsiz plan sınırlamaları

- İlk istekten sonra 15 dakika aktivite yoksa servis uyur
- İlk bağlantıda 30-60 saniye gecikme olabilir
- Bu normal ve beklenen bir durumdur

### Netlify deploy hataları

- `public` klasörünün doğru publish directory olarak ayarlandığından emin olun
- `.gitignore` dosyasında `public` klasörünün göz ardı edilmediğinden emin olun

## 📊 Deploy Sonrası

✅ Frontend URL: `https://your-app.netlify.app`
✅ Backend URL: `https://yazipaylas-backend.onrender.com`
✅ Gerçek zamanlı işbirliği çalışıyor
✅ Screenshot yapıştırma çalışıyor

## 🎉 Tebrikler!

Uygulamanız artık canlıda ve herkes kullanabilir!
