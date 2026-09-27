import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI Biography Story Drafting Endpoint
app.post('/api/ai/story-draft', async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, birthPlace, deathDate, deathPlace, occupation, spouseName, childrenCount, keyMilestones, tone } = req.body;

    if (!aiClient) {
      return res.status(200).json({ story: null, note: 'Using local engine fallback' });
    }

    const prompt = `Anda adalah penulis biografi keluarga dan kurator arsip sejarah keluarga Indonesia yang santun, hangat, dan bermartabat.
Tuliskan draf biografi pendek (2-3 paragraf) dalam Bahasa Indonesia untuk anggota keluarga berikut berdasarkan HANYA fakta-fakta yang diberikan di bawah ini. JANGAN mengarang fakta tanggal atau tempat yang tidak disebutkan.

Fakta Anggota:
- Nama Lengkap: ${fullName}
- Lahir: ${birthDate || 'Tidak tercatat'} di ${birthPlace || 'Tidak tercatat'}
- Wafat: ${deathDate ? `${deathDate} di ${deathPlace || '–'}` : 'Masih hidup'}
- Profesi: ${occupation || '–'}
- Pasangan: ${spouseName || '–'}
- Jumlah Anak: ${childrenCount || '–'}
- Catatan Khusus: ${keyMilestones ? keyMilestones.join(', ') : '–'}
- Nada Penulisan: ${tone || 'hangat'}

Sajikan dalam gaya editorial yang elegan, menyentuh, dan mencerminkan adab penghormatan kepada keluarga.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const story = response.text;
    res.json({ story });
  } catch (error: any) {
    console.error('Error generating AI story draft:', error);
    res.status(200).json({ story: null, error: error.message });
  }
});

// Photo caption suggestion endpoint
app.post('/api/ai/caption-suggest', async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    if (!aiClient) {
      return res.status(200).json({ caption: null });
    }

    const prompt = `Buat 1 kalimat keterangan arsip foto keluarga Indonesia yang bernuansa hangat dan penuh kenangan untuk konteks berikut: "${context}". Tulislah dalam Bahasa Indonesia yang indah dan bersahaja.`;
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ caption: response.text });
  } catch (error: any) {
    res.status(200).json({ caption: null });
  }
});

// Mount Vite in dev mode
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Silsantara server is running on http://0.0.0.0:${port}`);
  });
}

startServer();
