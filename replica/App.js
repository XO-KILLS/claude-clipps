import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Dimensions, FlatList } from 'react-native';

// Mock Tokens from replica/design/tokens.json
const Tokens = {
  colors: {
    bg: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    borderInput: '#475569',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#6366F1',
    onAccent: '#FFFFFF',
    danger: '#EF4444',
    success: '#22C55E',
  },
  radius: {
    md: 8,
    lg: 16,
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  }
};

// --- MOCK DATA LAYER (Now with Gallery storage) ---
const MockApi = {
  generate: async (prompt) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: 'gen_' + Math.random().toString(36).substr(2, 9), status: 'queued' };
  },
  pollStatus: async (id) => {
    const statuses = ['queued', 'processing', 'processing', 'completed'];
    const idx = Math.floor(Math.random() * statuses.length);
    return { id, status: statuses[idx], videoUrl: idx === 3 ? 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' : null };
  },
  getGallery: async () => {
    return [
      { id: '1', prompt: 'Cyberpunk City', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', model: 'SVD' },
      { id: '2', prompt: 'Deep Sea Diver', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', model: 'CogVideo' },
      { id: '3', prompt: 'Floating Islands', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', model: 'Luma' },
    ];
  }
};

// --- COMPONENTS ---

const PromptBox = ({ value, onChange, error }) => (
  <View style={styles.promptContainer}>
    <TextInput
      style={[styles.input, error && { borderColor: Tokens.colors.danger }]}
      placeholder="Describe the video you want to create..."
      placeholderTextColor={Tokens.colors.textMuted}
      multiline
      value={value}
      onChangeText={onChange}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const GenProgressBar = ({ status, progress }) => {
  const getStatusColor = () => {
    if (status === 'completed') return Tokens.colors.success;
    if (status === 'failed') return Tokens.colors.danger;
    return Tokens.colors.accent;
  };

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.statusText}>{status.toUpperCase()}...</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: getStatusColor() }]} />
      </View>
    </View>
  );
};

// --- SCREENS ---

const S01_Home = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!prompt) return;
    setLoading(true);
    await onGenerate(prompt);
    setLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>AI Video Studio</Text>
      <PromptBox value={prompt} onChange={setPrompt} />
      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.7 }]}
        onPress={handlePress}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={Tokens.colors.onAccent} /> : <Text style={styles.buttonText}>Generate Video</Text>}
      </TouchableOpacity>
    </View>
  );
};

const S03_Hub = ({ generationId, onComplete }) => {
  const [status, setStatus] = useState('queued');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await MockApi.pollStatus(generationId);
      setStatus(res.status);
      if (res.status === 'processing') setProgress(prev => Math.min(prev + 15, 90));
      if (res.status === 'completed') {
        setProgress(100);
        clearInterval(interval);
        onComplete(res.videoUrl);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [generationId]);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Generating...</Text>
      <View style={styles.center}>
        <GenProgressBar status={status} progress={progress} />
        <Text style={styles.mutedText}>Our AI is dreaming up your scene. This usually takes 1-2 minutes.</Text>
      </View>
    </View>
  );
};

const S04_Gallery = ({ onSelect }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockApi.getGallery().then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <View style={styles.screen}><ActivityIndicator size="large" color={Tokens.colors.accent} /></View>;

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Your Gallery</Text>
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.videoCard} onPress={() => onSelect(item.url)}>
            <View style={styles.videoThumbnail}>
              <Text style={{ color: Tokens.colors.textMuted, fontSize: 10 }}>{item.model}</Text>
            </View>
            <Text style={styles.videoTitle} numberOfLines={1}>{item.prompt}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const S05_Detail = ({ videoUrl }) => (
  <View style={styles.screen}>
    <Text style={styles.header}>Your Creation</Text>
    <View style={styles.videoPlayer}>
      <Text style={{ color: Tokens.colors.text, fontWeight: 'bold' }}>Native Android Video Player</Text>
      <Text style={{ color: Tokens.colors.textMuted, textAlign: 'center' }}>{videoUrl}</Text>
      {/* Actual implementation would use react-native-video */}
    </View>
    <TouchableOpacity style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>Download to Gallery</Text>
    </TouchableOpacity>
  </View>
);

// --- MAIN APP ENTRY ---

export default function App() {
  const [screen, setScreen] = useState('S01');
  const [currentGenId, setCurrentGenId] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const startGeneration = async (prompt) => {
    const res = await MockApi.generate(prompt);
    setCurrentGenId(res.id);
    setScreen('S03');
  };

  const finishGeneration = (url) => {
    setCurrentVideoUrl(url);
    setScreen('S05');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Tokens.colors.bg }}>
      {screen === 'S01' && <S01_Home onGenerate={startGeneration} />}
      {screen === 'S03' && <S03_Hub generationId={currentGenId} onComplete={finishGeneration} />}
      {screen === 'S04' && <S04_Gallery onSelect={(url) => { setCurrentVideoUrl(url); setScreen('S05'); }} />}
      {screen === 'S05' && <S05_Detail videoUrl={currentVideoUrl} />}

      {/* Simple Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('S01')}>
          <Text style={styles.navText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('S04')}>
          <Text style={styles.navText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Tokens.spacing.lg, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: Tokens.colors.text, marginBottom: Tokens.spacing.lg, textAlign: 'center' },
  promptContainer: { marginBottom: Tokens.spacing.lg },
  input: {
    backgroundColor: Tokens.colors.surface,
    borderColor: Tokens.colors.borderInput,
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    color: Tokens.colors.text,
    padding: Tokens.spacing.md,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  errorText: { color: Tokens.colors.danger, fontSize: 14, marginTop: Tokens.spacing.sm },
  primaryButton: {
    backgroundColor: Tokens.colors.accent,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center'
  },
  buttonText: { color: Tokens.colors.onAccent, fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    backgroundColor: Tokens.colors.surface,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
    marginTop: Tokens.spacing.lg
  },
  secondaryButtonText: { color: Tokens.colors.text, fontSize: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },
  progressContainer: { width: '100%', alignItems: 'center' },
  statusText: { color: Tokens.colors.text, fontSize: 18, fontWeight: '600', marginBottom: Tokens.spacing.md },
  progressTrack: { width: '100%', height: 10, backgroundColor: Tokens.colors.border, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', transition: 'width 0.3s ease' },
  mutedText: { color: Tokens.colors.textMuted, textAlign: 'center', marginTop: Tokens.spacing.md, fontSize: 14 },
  videoPlayer: {
    width: '100%',
    aspectRatio: 9/16,
    backgroundColor: '#000',
    borderRadius: Tokens.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Tokens.colors.border,
    padding: 20
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: Tokens.colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Tokens.colors.border
  },
  navItem: { alignItems: 'center' },
  navText: { color: Tokens.colors.textMuted, fontSize: 14, fontWeight: '600' },
  videoCard: {
    flex: 1,
    margin: Tokens.spacing.sm,
    backgroundColor: Tokens.colors.surface,
    borderRadius: Tokens.radius.md,
    overflow: 'hidden'
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Tokens.colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoTitle: {
    padding: Tokens.spacing.sm,
    color: Tokens.colors.text,
    fontSize: 12,
    textAlign: 'center'
  }
});
