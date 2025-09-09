import { useState, useRef, useEffect } from "react";
import { Play, Square, Mic, MicOff, Camera, CameraOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Practice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [sessionTime, setSessionTime] = useState(0);
  const [wpm, setWpm] = useState(145);
  const [volume, setVolume] = useState(75);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [feedbackMessages, setFeedbackMessages] = useState([
    { type: "positive", message: "Great eye contact! Keep it up!", timestamp: "00:15" },
    { type: "warning", message: "Try to slow down a bit", timestamp: "00:32" },
    { type: "positive", message: "Your tone is engaging and confident", timestamp: "00:45" },
  ]);

  // Mock AI feedback generation
  const generateFeedback = () => {
    const positiveMessages = [
      "Excellent posture and presence!",
      "Your voice projection is perfect",
      "Great use of hand gestures",
      "Maintaining good eye contact",
      "Your pace is just right",
      "Confident and clear delivery"
    ];
    
    const warningMessages = [
      "Try to speak a bit slower",
      "Your volume could be slightly higher",
      "Maintain more eye contact with the camera",
      "Try to reduce filler words",
      "Keep your hands visible and expressive"
    ];
    
    const isPositive = Math.random() > 0.3;
    const messages = isPositive ? positiveMessages : warningMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    const timestamp = `${Math.floor(sessionTime / 60).toString().padStart(2, '0')}:${(sessionTime % 60).toString().padStart(2, '0')}`;
    
    setFeedbackMessages(prev => [
      { type: isPositive ? "positive" : "warning", message, timestamp },
      ...prev.slice(0, 4)
    ]);
  };

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Generate random fluctuations
        setConfidenceScore(prev => Math.max(70, Math.min(98, prev + (Math.random() - 0.5) * 4)));
        setWpm(prev => Math.max(120, Math.min(180, prev + (Math.random() - 0.5) * 10)));
        setVolume(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 8)));
        
        // Generate feedback occasionally
        if (Math.random() > 0.85) {
          generateFeedback();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, sessionTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
      setSessionTime(0);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    
    // Save session data to localStorage
    const sessionData = {
      date: new Date().toISOString(),
      duration: sessionTime,
      confidenceScore: Math.round(confidenceScore),
      wpm,
      volume,
      feedback: feedbackMessages
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('speechSenseSessions') || '[]');
    localStorage.setItem('speechSenseSessions', JSON.stringify([sessionData, ...existingSessions]));
  };

  const resetSession = () => {
    setSessionTime(0);
    setConfidenceScore(85);
    setWpm(145);
    setVolume(75);
    setFeedbackMessages([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Practice Room</h1>
          <p className="text-muted-foreground">Practice your presentation with real-time AI feedback</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  {!isCameraOff ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      <CameraOff className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">REC {formatTime(sessionTime)}</span>
                    </div>
                  )}
                  
                  {/* Confidence Score Overlay */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 glass-effect text-white p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{Math.round(confidenceScore)}%</div>
                        <div className="text-xs opacity-80">Confidence</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} variant="hero" size="lg" className="group">
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" size="lg">
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="outline"
                    size="lg"
                    className={isMuted ? "bg-red-500/10 border-red-500/50" : ""}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    variant="outline"
                    size="lg"
                    className={isCameraOff ? "bg-red-500/10 border-red-500/50" : ""}
                  >
                    {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  </Button>
                  
                  <Button onClick={resetSession} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Live Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Confidence Score</span>
                    <span className="font-medium">{Math.round(confidenceScore)}%</span>
                  </div>
                  <Progress value={confidenceScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Words per Minute</span>
                    <span className="font-medium">{Math.round(wpm)}</span>
                  </div>
                  <Progress value={(wpm / 200) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Volume Level</span>
                    <span className="font-medium">{Math.round(volume)}%</span>
                  </div>
                  <Progress value={volume} className="h-2" />
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground">Session Time</div>
                  <div className="text-xl font-mono font-bold">{formatTime(sessionTime)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Live Feedback */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Live Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {feedbackMessages.map((feedback, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${
                        feedback.type === "positive"
                          ? "bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300"
                          : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span>{feedback.message}</span>
                        <span className="text-xs opacity-60 ml-2">{feedback.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  
                  {feedbackMessages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Start recording to see live feedback
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;