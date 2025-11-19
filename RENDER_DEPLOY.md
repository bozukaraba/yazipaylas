# Backend Deployment (Render.com)

1. https://render.com adresine git ve GitHub ile giriş yap
2. "New +" butonuna tıkla
3. "Web Service" seç
4. Bu GitHub reposunu bağla: bozukaraba/yazipaylas
5. Ayarları yap:
   - Name: yazipaylas-backend
   - Region: Frankfurt (EU Central)
   - Branch: main
   - Root Directory: (boş bırak)
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Instance Type: Free
6. "Create Web Service" butonuna tıkla
7. Deploy tamamlandıktan sonra URL'yi kopyala (örn: https://yazipaylas-backend.onrender.com)
8. Bu URL'yi bir sonraki adımda kullanacağız!
