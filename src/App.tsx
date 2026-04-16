import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  Settings, 
  LogOut, 
  User, 
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Camera,
  Upload,
  Menu,
  X,
  Bell,
  Languages,
  Zap,
  Activity,
  ShieldCheck,
  Maximize2,
  RefreshCcw
} from 'lucide-react';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#1e293b] rounded-[32px] border-2 border-dashed border-[#E2E8F0] dark:border-[#334155]">
          <div className="w-16 h-16 bg-[#FEF2F2] dark:bg-[#450a0a] rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h2 className="text-2xl font-black text-[#1E293B] dark:text-white tracking-tight">Something went wrong</h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] mt-2 mb-8 max-w-md font-medium">
            We encountered an error while rendering this view. This might be due to missing data or a temporary glitch.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#0D9488] hover:bg-[#0D9488]/90 h-12 px-8 rounded-xl font-bold"
          >
            <RefreshCcw className="mr-2 w-4 h-4" /> Reload Application
          </Button>
          <pre className="mt-8 p-4 bg-[#F8FAFC] dark:bg-[#0f172a] rounded-xl text-left text-xs text-[#EF4444] overflow-auto max-w-full">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChronicCondition, ScanResult, UserProfile } from './types';
import { analyzeLabel } from './services/gemini';

// --- Components ---

const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8FAFC]">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-white border-r border-[#E2E8F0]">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-2 text-[#0D9488] font-extrabold text-2xl">
            <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">S</div>
            Swastha.
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight text-[#1E293B]">
            Decode your food, <span className="text-[#0D9488]">Elevate your health.</span>
          </h1>
          <p className="text-xl text-[#64748B]">
            The AI-powered engine that reveals the truth behind every label and suggests healthier Indian alternatives.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <Card className="border-[#E2E8F0] shadow-none bg-white rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 text-[#1E293B]">Ingredient Decoder</h3>
                <p className="text-sm text-[#64748B]">Bypass marketing claims with objective analysis.</p>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0] shadow-none bg-white rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 text-[#1E293B]">Disease-Specific</h3>
                <p className="text-sm text-[#64748B]">Localized Indian whole-food recommendations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-[#E2E8F0] shadow-xl rounded-[24px]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-[#1E293B]">Welcome</CardTitle>
              <CardDescription className="text-[#64748B]">Enter your details to continue your health journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1E293B]">Email Address</label>
                <Input 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-[#E2E8F0]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1E293B]">Password</label>
                <Input type="password" placeholder="••••••••" className="rounded-xl border-[#E2E8F0]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-[#E2E8F0]" />
                  <span className="text-[#64748B]">Remember me</span>
                </div>
                <a href="#" className="text-[#0D9488] font-semibold">Forgot password?</a>
              </div>
              <Button 
                className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 h-12 text-lg rounded-xl shadow-[0_10px_15px_-3px_rgba(13,148,136,0.3)]"
                onClick={() => onLogin(email || 'user@example.com')}
              >
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><Separator className="bg-[#E2E8F0]" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#64748B]">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-xl border-[#E2E8F0]">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="Google" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (conditions: ChronicCondition[]) => void }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ChronicCondition[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const conditions: ChronicCondition[] = [
    "PCOS & Insulin Resistance",
    "Type-2 Diabetes",
    "IBS & Gut Health",
    "Hypertension",
    "Celiac Disease",
    "Thyroid Disorders",
    "Fatty Liver",
    "Chronic Kidney Disease",
    "Heart Disease",
    "Lactose Intolerance",
    "Gout & Uric Acid",
    "General Wellness"
  ];

  const filtered = conditions.filter(c => 
    c.toLowerCase().includes(search.toLowerCase()) && !selected.includes(c)
  );

  const toggleCondition = (c: ChronicCondition) => {
    if (selected.includes(c)) {
      setSelected(selected.filter(item => item !== c));
    } else {
      setSelected([...selected, c]);
      setSearch('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <Badge variant="secondary" className="bg-[#F0FDFA] text-[#0D9488] hover:bg-[#F0FDFA] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">PERSONALIZATION</Badge>
        <h1 className="text-5xl font-extrabold tracking-tight text-[#1E293B]">
          What health conditions are <span className="text-[#0D9488]">you managing?</span>
        </h1>
        <p className="text-[#64748B] text-lg">Select all that apply. Swastha will tailor its analysis for your unique profile.</p>
        
        <div className="relative max-w-xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <AnimatePresence>
              {selected.map(c => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge 
                    className="bg-[#0D9488] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-[#0D9488]/90"
                    onClick={() => toggleCondition(c)}
                  >
                    {c} <X className="w-3 h-3" />
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 bg-white border border-[#E2E8F0] rounded-2xl p-2 shadow-xl shadow-slate-200/50 relative z-20">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-[#64748B] mr-2" />
              <Input 
                className="border-none shadow-none focus-visible:ring-0 text-lg p-0 text-[#1E293B]" 
                placeholder="Search (e.g. PCOS, Thyroid, Heart...)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </div>
            <Button 
              onClick={() => selected.length > 0 && onComplete(selected)}
              disabled={selected.length === 0}
              className="bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl px-8 h-12 font-bold disabled:opacity-50"
            >
              Continue
            </Button>
          </div>

          <AnimatePresence>
            {showDropdown && search.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden z-10"
              >
                {filtered.length > 0 ? (
                  <div className="max-h-[300px] overflow-auto">
                    {filtered.map((c) => (
                      <button
                        key={c}
                        className="w-full px-6 py-4 text-left hover:bg-[#F0FDFA] hover:text-[#0D9488] transition-colors flex items-center justify-between group border-b border-[#F1F5F9] last:border-0"
                        onClick={() => toggleCondition(c as ChronicCondition)}
                      >
                        <span className="font-semibold">{c}</span>
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-[#64748B] text-sm italic">
                    No matching conditions found. Try a different search.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-xs text-[#64748B] flex items-center justify-center gap-1">
          <Settings className="w-3 h-3" /> Your medical data stays private and on-device via local AI.
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, results, onScan, onViewResult, onViewHistory }: { user: UserProfile, results: ScanResult[], onScan: () => void, onViewResult: (r: ScanResult) => void, onViewHistory: () => void }) => {
  const getRatingColor = (rating: string) => {
    if (rating === 'green') return 'bg-[#0D9488]';
    if (rating === 'yellow') return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
  };

  const getRatingText = (rating: string) => {
    if (rating === 'green') return 'SAFE';
    if (rating === 'yellow') return 'CAUTION';
    return 'CRITICAL';
  };

  const getRatingTextColor = (rating: string) => {
    if (rating === 'green') return 'text-[#0D9488]';
    if (rating === 'yellow') return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1E293B] dark:text-white transition-colors">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-[#64748B] dark:text-[#94A3B8]">Your personalized health analysis is ready.</p>
          </div>
        </header>

        <section className="space-y-8">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-[#1e293b] border-2 border-dashed border-[#E2E8F0] dark:border-[#334155] rounded-[24px] p-10 flex flex-col items-center justify-center text-center bg-[radial-gradient(#F0FDFA_1px,transparent_1px)] dark:bg-[radial-gradient(#0D94881a_1px,transparent_1px)] bg-[length:20px_20px] hover:border-[#0D9488] transition-colors"
          >
            <div className="w-16 h-16 bg-[#F0FDFA] dark:bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h2 className="text-xl font-bold text-[#1E293B] dark:text-white">Analyze New Product</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] max-w-[300px] mt-2 mb-6">Upload or scan a product label to detect allergens and hidden triggers for your conditions.</p>
            <Button onClick={onScan} className="bg-[#0D9488] hover:bg-[#0D9488]/90 h-14 px-8 rounded-xl font-bold shadow-[0_10px_15px_-3px_rgba(13,148,136,0.3)]">
              Quick Scan & Upload
            </Button>
          </motion.div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">Recent Scans</h3>
              <button onClick={onViewHistory} className="text-sm font-bold text-[#0D9488] hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {results.length === 0 && (
                <Card className="border-[#E2E8F0] dark:border-[#334155] rounded-2xl bg-white dark:bg-[#1e293b]">
                  <CardContent className="p-8 text-center text-[#64748B] dark:text-[#94A3B8]">No scans yet. Start by analyzing a product.</CardContent>
                </Card>
              )}
              {results.slice(0, 3).map((result, index) => (
                <motion.div 
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onViewResult(result)}
                  className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-4 hover:shadow-sm transition-all hover:border-[#0D9488] cursor-pointer group"
                >
                  <div className={`w-2 h-2 rounded-full ${getRatingColor(result.rating)}`} />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#1E293B] dark:text-white group-hover:text-[#0D9488] transition-colors">{result.productName}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate max-w-[300px]">{result.warnings[0]?.name || 'No hidden spikers detected'}</div>
                  </div>
                  <div className={`text-right font-bold text-sm ${getRatingTextColor(result.rating)}`}>
                    {getRatingText(result.rating)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <Card className="border-[#E2E8F0] dark:border-[#334155] rounded-[24px] p-6 bg-white dark:bg-[#1e293b] space-y-6 shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold block mb-1">Condition Focus</span>
            <div className="flex flex-wrap gap-2">
              {user.conditions.map(c => (
                <div key={c} className="bg-[#FEF2F2] dark:bg-[#450a0a] text-[#991B1B] dark:text-[#fecaca] px-2 py-1 rounded-lg text-[10px] font-bold">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#0f172a] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
            <span className="text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold block mb-1">Safety Overview</span>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-[#E2E8F0] dark:bg-[#334155] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#0D9488]" style={{ width: `${(results.filter(r => r.rating === 'green').length / (results.length || 1)) * 100}%` }} />
                <div className="h-full bg-[#F59E0B]" style={{ width: `${(results.filter(r => r.rating === 'yellow').length / (results.length || 1)) * 100}%` }} />
                <div className="h-full bg-[#EF4444]" style={{ width: `${(results.filter(r => r.rating === 'red').length / (results.length || 1)) * 100}%` }} />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8]">
              <span>{results.filter(r => r.rating === 'green').length} Safe</span>
              <span>{results.filter(r => r.rating === 'red').length} Risky</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold block mb-1">Recommended Swap</span>
            {results[0] ? (
              <div className="bg-[#F0FDFA] dark:bg-[#0D9488]/10 border border-[#0D9488] rounded-xl p-3 mt-2">
                <div className="text-[13px] font-bold text-[#0D9488]">Instead of {results[0].productName}:</div>
                <div className="text-[13px] text-[#1E293B] dark:text-white mt-1 font-medium">{results[0].alternatives[0]?.name}</div>
                <div className="text-[11px] text-[#0D9488] mt-2 flex items-center gap-1 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" /> Multi-Condition Safe
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] italic">Scan a product to see swaps</p>
            )}
          </div>

          <div className="mt-auto pt-4">
            <div className="bg-[#1E293B] dark:bg-[#0f172a] text-white p-5 rounded-2xl relative overflow-hidden group border dark:border-[#334155]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-[#0D9488]" />
                  <span className="text-[12px] font-bold opacity-80 uppercase tracking-widest">Health Streak</span>
                </div>
                <div className="text-3xl font-extrabold my-1">12 Days</div>
                <div className="text-[11px] opacity-60 font-medium">Consecutive days of safe choices</div>
              </div>
              <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
};

const CameraView = ({ onCapture, onCancel }: { onCapture: (img: string) => void, onCancel: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onCancel();
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg');
        onCapture(data);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  return (
    <div className="relative aspect-[4/3] bg-black rounded-[32px] overflow-hidden group shadow-2xl">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90" />
      
      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corners */}
        <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-[#0D9488] rounded-tl-2xl" />
        <div className="absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-[#0D9488] rounded-tr-2xl" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-[#0D9488] rounded-bl-2xl" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-[#0D9488] rounded-br-2xl" />
        
        {/* Scanning Line Animation */}
        <motion.div 
          animate={{ top: ['25%', '75%', '25%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#0D9488] to-transparent shadow-[0_0_20px_rgba(13,148,136,0.8)]"
        />

        <div className="absolute top-6 left-0 right-0 text-center">
          <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
            Align Ingredients List
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 px-6">
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="rounded-full w-12 h-12 p-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xl"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <button 
          onClick={capture} 
          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center group active:scale-90 transition-all shadow-2xl"
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner">
            <div className="w-10 h-10 rounded-full border-2 border-[#0D9488] flex items-center justify-center">
              <div className="w-6 h-6 bg-[#0D9488] rounded-full" />
            </div>
          </div>
        </button>

        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};

const Scanner = ({ onResult, onBack, conditions, lang }: { onResult: (result: ScanResult) => void, onBack: () => void, conditions: ChronicCondition[], lang: string }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      'EN': 'English',
      'HI': 'Hindi',
      'BN': 'Bengali',
      'MR': 'Marathi',
      'TA': 'Tamil',
      'TE': 'Telugu',
      'GU': 'Gujarati',
      'KN': 'Kannada'
    };
    return names[code] || 'English';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeLabel(image, conditions, getLanguageName(lang));
      onResult({
        ...result,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        image,
        conditions
      });
    } catch (err) {
      console.error(err);
      setError("Unable to analyze this label. Please ensure the ingredients are clearly visible and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1e293b]">
          <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> Back
        </Button>
        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
          {conditions.map(c => (
            <Badge key={c} className="bg-[#F0FDFA] dark:bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20 rounded-full px-2 py-0.5 font-bold text-[10px]">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-[#E2E8F0] dark:border-[#334155] shadow-xl rounded-[32px] overflow-hidden bg-white dark:bg-[#1e293b]">
          <CardContent className="p-0">
            {isCameraActive ? (
              <CameraView 
                onCapture={(img) => { setImage(img); setIsCameraActive(false); }} 
                onCancel={() => setIsCameraActive(false)} 
              />
            ) : !image ? (
              <div className="aspect-[4/3] flex flex-col items-center justify-center p-12 bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#1e293b] dark:to-[#0f172a]">
                <div className="w-24 h-24 bg-[#F0FDFA] dark:bg-[#0D9488]/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-lg border border-[#0D9488]/20">
                  <Camera className="w-10 h-10 text-[#0D9488]" />
                </div>
                <h3 className="text-3xl font-black text-[#1E293B] dark:text-white tracking-tight">Scan Product Label</h3>
                <p className="text-[#64748B] dark:text-[#94A3B8] mt-3 text-center max-w-sm font-medium leading-relaxed">
                  Position the ingredient list clearly within the frame for a precise health analysis.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button 
                    onClick={() => setIsCameraActive(true)}
                    className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 h-16 rounded-2xl font-bold text-lg shadow-xl shadow-[#0D9488]/20 group"
                  >
                    <Camera className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" /> Open Camera
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 rounded-2xl border-2 border-[#E2E8F0] dark:border-[#334155] h-16 font-bold text-lg dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-all"
                  >
                    <Upload className="mr-3 w-6 h-6" /> Upload Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] bg-black">
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/20" />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white dark:bg-[#1e293b]/90 dark:hover:bg-[#1e293b]"
                  onClick={() => setImage(null)}
                >
                  <X className="w-4 h-4 dark:text-white" />
                </Button>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-bold text-[#1E293B] dark:text-white animate-pulse">Analyzing ingredients...</p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">Checking for multi-condition triggers</p>
                  </div>
                )}
                {error && (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FEF2F2] dark:bg-[#450a0a] border border-[#EF4444] p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <p className="text-[11px] font-bold text-[#991B1B] dark:text-[#fecaca]">{error}</p>
                  </div>
                )}
              </div>
            ) }
          </CardContent>
          {image && !isAnalyzing && (
            <div className="p-6 bg-[#F8FAFC] dark:bg-[#1E293B]/50 border-t border-[#E2E8F0] dark:border-[#334155] flex gap-4">
              <Button 
                variant="outline"
                onClick={() => setImage(null)}
                className="flex-1 rounded-2xl h-14 font-bold border-[#E2E8F0] dark:border-[#334155] dark:text-white"
              >
                Retake
              </Button>
              <Button 
                onClick={handleAnalyze} 
                className="flex-[2] bg-[#0D9488] hover:bg-[#0D9488]/90 h-14 rounded-2xl font-bold text-lg shadow-[0_10px_15px_-3px_rgba(13,148,136,0.3)]"
              >
                Analyze Label <Zap className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange} 
      />

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className="h-full bg-[#0D9488]/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const VitalsView = () => {
  const vitals = [
    { label: 'Blood Glucose', value: '110 mg/dL', status: 'Normal', color: 'text-[#0D9488]', bg: 'bg-[#F0FDFA]' },
    { label: 'Blood Pressure', value: '120/80 mmHg', status: 'Optimal', color: 'text-[#0D9488]', bg: 'bg-[#F0FDFA]' },
    { label: 'Body Weight', value: '72 kg', status: 'Stable', color: 'text-[#64748B]', bg: 'bg-[#F8FAFC]' },
    { label: 'Daily Steps', value: '8,432', status: 'On Track', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1E293B] dark:text-white">My Vitals</h1>
        <p className="text-[#64748B] dark:text-[#94A3B8]">Monitor your key health metrics and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitals.map((v, i) => (
          <Card key={i} className="border-[#E2E8F0] dark:border-[#334155] rounded-[24px] bg-white dark:bg-[#1e293b] overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest">{v.label}</p>
                <Badge className={`${v.bg} ${v.color} border-none rounded-full px-2 py-0.5 text-[10px] font-bold`}>{v.status}</Badge>
              </div>
              <p className="text-2xl font-black text-[#1E293B] dark:text-white">{v.value}</p>
              <div className="h-1 bg-[#F1F5F9] dark:bg-[#334155] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  className="h-full bg-[#0D9488] rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#E2E8F0] dark:border-[#334155] rounded-[24px] bg-white dark:bg-[#1e293b] p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F0FDFA] dark:bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8 text-[#0D9488]" />
        </div>
        <h3 className="text-xl font-bold text-[#1E293B] dark:text-white">Connect Health Devices</h3>
        <p className="text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">Sync your Apple Health, Google Fit, or wearable devices to automatically track your vitals.</p>
        <Button className="bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl px-8 font-bold">Connect Now</Button>
      </Card>
    </div>
  );
};

const ResultView = ({ result, onBack }: { result: ScanResult, onBack: () => void }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const getRatingStyles = (rating: string) => {
    if (rating === 'green') return {
      text: 'text-[#0D9488]',
      bg: 'bg-[#F0FDFA]',
      border: 'border-[#0D9488]',
      label: 'SAFE',
      icon: <CheckCircle2 className="w-6 h-6 text-[#0D9488]" />
    };
    if (rating === 'yellow') return {
      text: 'text-[#F59E0B]',
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#F59E0B]',
      label: 'CAUTION',
      icon: <AlertCircle className="w-6 h-6 text-[#F59E0B]" />
    };
    return {
      text: 'text-[#EF4444]',
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#EF4444]',
      label: 'CRITICAL',
      icon: <AlertCircle className="w-6 h-6 text-[#EF4444]" />
    };
  };

  const styles = getRatingStyles(result.rating);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between px-2">
        <Button variant="ghost" onClick={onBack} className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1e293b] rounded-xl px-4 py-2">
          <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-[#E2E8F0] dark:border-[#334155] text-xs font-bold">Share Report</Button>
          <Button variant="outline" className="rounded-xl border-[#E2E8F0] dark:border-[#334155] text-xs font-bold">Download PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Main Result & Cautions */}
        <div className="lg:col-span-8 space-y-12">
          <Card className="border-[#E2E8F0] dark:border-[#334155] shadow-md rounded-[32px] overflow-hidden bg-white dark:bg-[#1e293b]">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-64 shrink-0">
                  <div 
                    className="aspect-square rounded-3xl overflow-hidden border-2 border-[#F1F5F9] dark:border-[#334155] cursor-zoom-in group relative shadow-inner"
                    onClick={() => setIsImageExpanded(true)}
                  >
                    <img src={result.image} alt="Product" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {result.conditions?.map(c => (
                        <Badge key={c} className="bg-[#F0FDFA] dark:bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                          {c}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h1 className="text-5xl font-black text-[#1E293B] dark:text-white tracking-tighter leading-[1.1]">{result.productName || 'Unknown Product'}</h1>
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest shadow-sm ${styles.bg} ${styles.border} ${styles.text}`}>
                          {styles.label}
                        </div>
                        <span className="text-[#64748B] dark:text-[#94A3B8] text-xs font-bold">Analyzed on {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                    
                    <p className={`text-3xl font-black leading-tight tracking-tight ${
                      result.rating === 'red' ? 'text-[#EF4444]' : 
                      result.rating === 'yellow' ? 'text-[#F59E0B]' : 
                      'text-[#0D9488]'
                    }`}>
                      {result.summary || 'No summary available.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-12 gap-y-6 pt-6 border-t border-[#F1F5F9] dark:border-[#334155]">
                    {result.nutrients?.slice(0, 4).map((n, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <p className="text-[9px] text-[#64748B] dark:text-[#94A3B8] uppercase font-black tracking-wider break-words max-w-[120px] leading-tight">{n.label}</p>
                        <p className="font-black text-[#1E293B] dark:text-white text-2xl whitespace-nowrap leading-none">{n.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cautions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FEF2F2] dark:bg-[#450a0a] rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-[#1E293B] dark:text-white tracking-tight">Harmful Elements</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-bold">Detected multi-condition triggers</p>
                </div>
              </div>
              <Badge className="bg-[#FEF2F2] dark:bg-[#450a0a] text-[#EF4444] border-none font-black px-3 py-1 rounded-full">{(result.warnings || []).length} Found</Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {result.warnings?.map((warning, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white dark:bg-[#1e293b] border border-[#F1F5F9] dark:border-[#334155] rounded-[24px] flex items-start gap-5 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#FEF2F2] dark:bg-[#450a0a] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <X className="w-6 h-6 text-[#EF4444]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-[#1E293B] dark:text-white tracking-tight uppercase">{warning.name}</p>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">{warning.explanation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alternatives */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-[#F0FDFA] dark:bg-[#0D9488]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-black text-xl text-[#1E293B] dark:text-white tracking-tight">Safe Swaps</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-bold">Healthier alternatives</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {result.alternatives?.map((alt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Card className="border-[#F1F5F9] dark:border-[#334155] shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] bg-white dark:bg-[#1e293b] overflow-hidden group border-b-4 border-b-[#0D9488]">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-[#1E293B] dark:text-white text-base tracking-tight">{alt.name}</h4>
                        <div className="w-6 h-6 bg-[#F0FDFA] dark:bg-[#0D9488]/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">{alt.reason}</p>
                      <Button className="w-full bg-[#F8FAFC] dark:bg-[#0f172a] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#334155] rounded-xl h-10 text-xs font-black transition-all group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488]">
                        Find on {['Zepto', 'Blinkit', 'Instamart'][i % 3]} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="border-none bg-gradient-to-br from-[#1E293B] to-[#0f172a] text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-[#0D9488]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0D9488]">Expert Safety Tip</span>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">Always check the "Manufacturing Date" as older stocks might have different ingredient formulations.</p>
              <div className="pt-2">
                <Button variant="link" className="text-[#0D9488] p-0 h-auto font-black text-xs hover:no-underline">Learn more about safety standards →</Button>
              </div>
            </div>
            <Activity className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-500 rotate-12" />
          </Card>
        </div>
      </div>

      {/* Image Expansion Modal */}
      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsImageExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={result.image} alt="Expanded Product" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
              <Button 
                variant="ghost" 
                className="absolute top-0 right-0 text-white hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={() => setIsImageExpanded(false)}
              >
                <X className="w-8 h-8" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'login' | 'onboarding' | 'dashboard' | 'scanner' | 'result' | 'history' | 'settings' | 'vitals'>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI' | 'BN' | 'MR' | 'TA' | 'TE' | 'GU' | 'KN'>('EN');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (email: string) => {
    setUser({ name: 'Sanskar Gupta', email, conditions: ['General Wellness'] });
    setView('onboarding');
  };

  const handleOnboarding = (conditions: ChronicCondition[]) => {
    if (user) {
      setUser({ ...user, conditions });
      setView('dashboard');
    }
  };

  const handleScanResult = (result: ScanResult) => {
    setResults([result, ...results]);
    setCurrentResult(result);
    setView('result');
  };

  if (view === 'login') return <Login onLogin={handleLogin} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboarding} />;

  const NavItem = ({ icon: Icon, label, target, active }: { icon: any, label: string, target: any, active: boolean }) => {
    const getLabel = () => {
      const translations: Record<string, Record<string, string>> = {
        'HI': { 'Dashboard': 'डैशबोर्ड', 'Scan History': 'स्कैन इतिहास', 'Safe Swaps': 'सुरक्षित विकल्प', 'My Vitals': 'मेरी सेहत', 'Settings': 'सेटिंग्स' },
        'BN': { 'Dashboard': 'ড্যাশবোর্ড', 'Scan History': 'স্ক্যান ইতিহাস', 'Safe Swaps': 'সুরক্ষিত অদলবদল', 'My Vitals': 'আমার ভাইটাল', 'Settings': 'সেটিংস' },
        'MR': { 'Dashboard': 'डॅशबोर्ड', 'Scan History': 'स्कॅन इतिहास', 'Safe Swaps': 'सुरक्षित पर्याय', 'My Vitals': 'माझे विटल्स', 'Settings': 'सेटिंग्ज' },
        'TA': { 'Dashboard': 'டாஷ்போர்டு', 'Scan History': 'ஸ்கேன் வரலாறு', 'Safe Swaps': 'பாதுகாப்பான மாற்றங்கள்', 'My Vitals': 'எனது முக்கிய அம்சங்கள்', 'Settings': 'அமைப்புகள்' },
        'TE': { 'Dashboard': 'డాష్‌బోర్డ్', 'Scan History': 'స్కాన్ చరిత్ర', 'Safe Swaps': 'సురక్షితమైన మార్పిడులు', 'My Vitals': 'నా వైటల్స్', 'Settings': 'సెట్టింగులు' },
        'GU': { 'Dashboard': 'ડેશબોર્ડ', 'Scan History': 'સ્કેન ઇતિહાસ', 'Safe Swaps': 'સુરક્ષિત સ્વેપ્સ', 'My Vitals': 'મારા વિટલ્સ', 'Settings': 'સેટિંગ્સ' },
        'KN': { 'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'Scan History': 'ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸ', 'Safe Swaps': 'ಸುರಕ್ಷಿತ ಬದಲಾವಣೆಗಳು', 'My Vitals': 'ನನ್ನ ವೈಟಲ್ಸ್', 'Settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' }
      };
      
      return translations[lang]?.[label] || label;
    };

    return (
      <button 
        onClick={() => { setView(target); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          active 
            ? 'bg-[#F0FDFA] dark:bg-[#0D9488]/10 text-[#0D9488]' 
            : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold text-sm">{getLabel()}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-white dark:bg-[#1e293b] border-r border-[#E2E8F0] dark:border-[#334155] p-6 space-y-8">
        <div className="flex items-center gap-2 text-[#0D9488] font-extrabold text-xl px-2">
          <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">S</div>
          Swastha.
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" target="dashboard" active={view === 'dashboard'} />
          <NavItem icon={Scan} label="Scan History" target="history" active={view === 'history'} />
          <NavItem icon={History} label="Safe Swaps" target="history" active={false} />
          <NavItem icon={User} label="My Vitals" target="vitals" active={view === 'vitals'} />
          <NavItem icon={Settings} label="Settings" target="settings" active={view === 'settings'} />
        </nav>

        <div className="pt-4 border-t border-[#E2E8F0] space-y-1">
          <NavItem icon={Bell} label="Help Center" target="dashboard" active={false} />
          <button 
            onClick={() => setView('login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-[#0D9488] font-extrabold text-xl">
            <div className="w-6 h-6 bg-[#0D9488] rounded-md flex items-center justify-center text-white text-xs">S</div>
            Swastha.
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#64748B] dark:text-[#94A3B8]"><Languages className="h-4 w-4" /></Button>} />
              <DropdownMenuContent align="end" className="max-h-[300px] overflow-auto bg-white dark:bg-[#1e293b] border-[#E2E8F0] dark:border-[#334155]">
                <DropdownMenuItem onClick={() => setLang('EN')} className="font-bold dark:text-white">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('HI')} className="font-bold dark:text-white">हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('BN')} className="font-bold dark:text-white">বাংলা (Bengali)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('MR')} className="font-bold dark:text-white">मराठी (Marathi)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('TA')} className="font-bold dark:text-white">தமிழ் (Tamil)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('TE')} className="font-bold dark:text-white">తెలుగు (Telugu)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('GU')} className="font-bold dark:text-white">ગુજરાતી (Gujarati)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('KN')} className="font-bold dark:text-white">ಕನ್ನಡ (Kannada)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div id="google_translate_element" className="scale-90 origin-right"></div>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-[#64748B] dark:text-[#94A3B8]"><Menu className="w-6 h-6" /></Button>} />
              <SheetContent side="left" className="w-[240px] p-6 bg-white dark:bg-[#1e293b] border-r dark:border-[#334155]">
                <div className="space-y-8">
                  <div className="flex items-center gap-2 text-[#0D9488] font-extrabold text-2xl">
                    <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center text-white">S</div>
                    Swastha.
                  </div>
                  <nav className="space-y-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" target="dashboard" active={view === 'dashboard'} />
                    <NavItem icon={Scan} label="Scan History" target="history" active={view === 'history'} />
                    <NavItem icon={User} label="My Vitals" target="vitals" active={view === 'vitals'} />
                    <NavItem icon={Settings} label="Settings" target="settings" active={view === 'settings'} />
                  </nav>
                  <Separator className="bg-[#E2E8F0] dark:bg-[#334155]" />
                  <Button variant="ghost" className="w-full justify-start text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-[#450a0a]" onClick={() => setView('login')}>
                    <LogOut className="mr-2 w-5 h-5" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white dark:bg-[#1e293b] border-b border-[#E2E8F0] dark:border-[#334155] h-16 items-center justify-end px-8 sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8] font-bold text-sm hover:text-[#1E293B] dark:hover:text-white">
                <Languages className="w-4 h-4" /> 
                {lang === 'EN' ? 'English' : 
                 lang === 'HI' ? 'हिन्दी' : 
                 lang === 'BN' ? 'বাংলা' :
                 lang === 'MR' ? 'मराठी' :
                 lang === 'TA' ? 'தமிழ்' :
                 lang === 'TE' ? 'తెలుగు' :
                 lang === 'GU' ? 'ગુજરાતી' : 'ಕನ್ನಡ'}
              </Button>} />
              <DropdownMenuContent align="end" className="rounded-xl border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1e293b] max-h-[400px] overflow-auto">
                <DropdownMenuItem onClick={() => setLang('EN')} className="font-bold dark:text-white dark:hover:bg-[#334155]">English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('HI')} className="font-bold dark:text-white dark:hover:bg-[#334155]">हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('BN')} className="font-bold dark:text-white dark:hover:bg-[#334155]">বাংলা (Bengali)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('MR')} className="font-bold dark:text-white dark:hover:bg-[#334155]">मराठी (Marathi)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('TA')} className="font-bold dark:text-white dark:hover:bg-[#334155]">தமிழ் (Tamil)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('TE')} className="font-bold dark:text-white dark:hover:bg-[#334155]">తెలుగు (Telugu)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('GU')} className="font-bold dark:text-white dark:hover:bg-[#334155]">ગુજરાતી (Gujarati)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('KN')} className="font-bold dark:text-white dark:hover:bg-[#334155]">ಕನ್ನಡ (Kannada)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div id="google_translate_element"></div>
            
            <Separator orientation="vertical" className="h-6 bg-[#E2E8F0] dark:bg-[#334155]" />

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-bold text-sm text-[#1E293B] dark:text-white">{user?.name}</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Premium Plan</div>
              </div>
              <Avatar className="w-10 h-10 border border-[#E2E8F0] dark:border-[#334155]">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#F1F5F9] dark:bg-[#0f172a] text-[#64748B] dark:text-[#94A3B8] font-bold">SG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'dashboard' && user && (
                  <Dashboard 
                    user={user} 
                    results={results} 
                    onScan={() => setView('scanner')} 
                    onViewResult={(r) => { setCurrentResult(r); setView('result'); }}
                    onViewHistory={() => setView('history')}
                  />
                )}
                {view === 'vitals' && <VitalsView />}
                {view === 'scanner' && user && <Scanner conditions={user.conditions} onResult={handleScanResult} onBack={() => setView('dashboard')} lang={lang} />}
                {view === 'result' && (
                  currentResult ? (
                    <ResultView result={currentResult} onBack={() => setView('dashboard')} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-[#F1F5F9] dark:bg-[#1e293b] rounded-full flex items-center justify-center mb-4">
                        <Scan className="w-8 h-8 text-[#64748B] dark:text-[#94A3B8]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">No result selected</h3>
                      <p className="text-[#64748B] dark:text-[#94A3B8] mb-6">Please scan a product or select one from history.</p>
                      <Button onClick={() => setView('dashboard')} className="bg-[#0D9488] font-bold">Back to Dashboard</Button>
                    </div>
                  )
                )}
                {view === 'history' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-extrabold text-[#1E293B] dark:text-white">Scan History</h1>
                      <p className="text-[#64748B] dark:text-[#94A3B8]">Review your past product scans.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-white font-bold">Export PDF</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.length === 0 && (
                      <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-[#F1F5F9] dark:bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="w-8 h-8 text-[#64748B] dark:text-[#94A3B8]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">No history found</h3>
                        <p className="text-[#64748B] dark:text-[#94A3B8]">Your scanned products will appear here.</p>
                      </div>
                    )}
                    {results.map((r) => (
                      <Card key={r.id} className="cursor-pointer hover:shadow-xl transition-all border-[#E2E8F0] dark:border-[#334155] rounded-[24px] overflow-hidden bg-white dark:bg-[#1e293b] group" onClick={() => { setCurrentResult(r); setView('result'); }}>
                        <div className="aspect-video bg-[#F8FAFC] dark:bg-[#0f172a] overflow-hidden relative">
                          <img src={r.image} alt={r.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 right-3">
                            <Badge className={`rounded-full px-3 py-1 font-bold ${
                              r.rating === 'green' ? 'bg-[#0D9488] text-white' : 
                              r.rating === 'yellow' ? 'bg-[#F59E0B] text-white' : 
                              'bg-[#EF4444] text-white'
                            }`}>
                              {r.rating === 'green' ? 'SAFE' : r.rating === 'yellow' ? 'CAUTION' : 'CRITICAL'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {r.conditions.slice(0, 2).map(c => (
                              <span key={c} className="text-[8px] font-bold text-[#64748B] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#0f172a] px-1.5 py-0.5 rounded uppercase">{c}</span>
                            ))}
                            {r.conditions.length > 2 && <span className="text-[8px] font-bold text-[#64748B] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#0f172a] px-1.5 py-0.5 rounded">+{r.conditions.length - 2}</span>}
                          </div>
                          <h4 className="font-bold text-[#1E293B] dark:text-white group-hover:text-[#0D9488] transition-colors">{r.productName}</h4>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2">{r.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {view === 'settings' && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#1E293B] dark:text-white">Settings</h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8]">Manage your profile and health preferences.</p>
                  </div>
                  <Card className="border-[#E2E8F0] dark:border-[#334155] rounded-[24px] bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden">
                    <CardHeader className="bg-[#F8FAFC] dark:bg-[#0f172a] border-b border-[#E2E8F0] dark:border-[#334155] p-6">
                      <CardTitle className="text-[#1E293B] dark:text-white font-bold">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <div className="flex items-center gap-6 mb-4">
                        <Avatar className="w-20 h-20 border-2 border-[#E2E8F0] dark:border-[#334155]">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-[#F1F5F9] dark:bg-[#0f172a] text-[#64748B] dark:text-[#94A3B8] text-2xl font-bold">SG</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" className="rounded-xl border-[#E2E8F0] dark:border-[#334155] font-bold dark:text-white">Change Avatar</Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#1E293B] dark:text-white">Full Name</label>
                          <Input defaultValue={user?.name} className="rounded-xl border-[#E2E8F0] dark:border-[#334155] dark:bg-[#0f172a] dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#1E293B] dark:text-white">Email Address</label>
                          <Input defaultValue={user?.email} disabled className="rounded-xl border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0f172a] dark:text-[#64748B]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E293B] dark:text-white">Chronic Conditions</label>
                        <div className="p-4 bg-[#F0FDFA] dark:bg-[#0D9488]/10 border border-[#0D9488] rounded-xl text-[#0D9488] font-bold flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            {user?.conditions.map(c => (
                              <Badge key={c} className="bg-[#0D9488] text-white rounded-lg px-2 py-1">{c}</Badge>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#0D9488] font-bold hover:bg-[#0D9488]/10" onClick={() => setView('onboarding')}>Update Conditions</Button>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
                        <h3 className="text-sm font-bold text-[#1E293B] dark:text-white uppercase tracking-widest">Appearance</h3>
                        <div className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-[#0D9488] text-white' : 'bg-white text-[#64748B] shadow-sm'}`}>
                              {darkMode ? <Zap className="w-4 h-4" /> : <Languages className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1E293B] dark:text-white">Dark Theme</p>
                              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Reduce eye strain in low light</p>
                            </div>
                          </div>
                          <Button 
                            variant={darkMode ? "default" : "outline"}
                            onClick={() => setDarkMode(!darkMode)}
                            className={`rounded-full px-6 font-bold ${darkMode ? 'bg-[#0D9488] hover:bg-[#0D9488]/90' : 'border-[#E2E8F0] text-[#1E293B]'}`}
                          >
                            {darkMode ? 'Enabled' : 'Disabled'}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="bg-[#0D9488] hover:bg-[#0D9488]/90 rounded-xl px-8 font-bold shadow-[0_10px_15px_-3px_rgba(13,148,136,0.3)]">Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
