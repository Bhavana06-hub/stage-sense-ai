import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Target, Timer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Exercises = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock confidence analysis
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        // Generate realistic confidence score that gradually improves
        const baseScore = 65 + Math.random() * 25;
        const timeBonus = Math.min(sessionTime * 0.5, 10); // Gradual improvement
        setConfidenceScore(Math.min(95, baseScore + timeBonus));
        
        // Mock WPM detection
        setWpm(120 + Math.floor(Math.random() * 40));
        
        // Randomly detect filler words
        if (Math.random() < 0.15) {
          setFillerCount(prev => prev + 1);
          setFeedback(prev => [...prev.slice(-4), "Filler word detected: 'um'"]);
        }
        
        // Add positive feedback
        if (Math.random() < 0.1) {
          const positiveFeedback = [
            "Great eye contact!",
            "Perfect speaking pace",
            "Confident tone detected",
            "Excellent volume level",
            "Good posture maintained"
          ];
          setFeedback(prev => [...prev.slice(-4), positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]]);
        }
      }, 2000);

      intervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [isRecording, sessionTime]);

  // Session timer
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setSessionTime(0);
      setFillerCount(0);
      setFeedback(["Recording started. Begin speaking..."]);
    } catch (error) {
      setFeedback(["Microphone access denied. Please allow microphone access."]);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setFeedback(prev => [...prev, "Session completed!"]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConfidenceColor = () => {
    if (confidenceScore >= 80) return "text-success";
    if (confidenceScore >= 60) return "text-warning";
    return "text-destructive";
  };

  const getWpmFeedback = () => {
    if (wpm < 130) return "Speak a bit faster";
    if (wpm > 160) return "Slow down slightly";
    return "Perfect pace!";
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interactive Exercises
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice specific skills with real-time AI feedback
          </p>
        </div>

        {/* Main Exercise Panel */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recording Control */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-full">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Speech Analysis Session
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-8">
                {/* Confidence Score Display */}
                <div className="space-y-4">
                  <div className="text-6xl font-bold">
                    <span className={getConfidenceColor()}>{Math.round(confidenceScore)}%</span>
                  </div>
                  <p className="text-lg text-muted-foreground">Confidence Level</p>
                  <Progress value={confidenceScore} className="w-full max-w-md mx-auto" />
                </div>

                {/* Recording Button */}
                <div className="space-y-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      variant="hero"
                      className="w-32 h-32 rounded-full text-lg"
                    >
                      <Mic className="w-8 h-8" />
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                      className="w-32 h-32 rounded-full text-lg"
                    >
                      <MicOff className="w-8 h-8" />
                    </Button>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>

                {/* Session Stats */}
                {isRecording && (
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{formatTime(sessionTime)}</div>
                      <div className="text-sm text-muted-foreground">Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{wpm}</div>
                      <div className="text-sm text-muted-foreground">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">{fillerCount}</div>
                      <div className="text-sm text-muted-foreground">Fillers</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Real-time Feedback Panel */}
          <div className="space-y-6">
            {/* Confidence Tracker */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Confidence Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Level</span>
                    <span className={`font-bold ${getConfidenceColor()}`}>
                      {Math.round(confidenceScore)}%
                    </span>
                  </div>
                  <Progress value={confidenceScore} />
                  <p className="text-xs text-muted-foreground">
                    Analyzing voice tone, pace, and clarity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Speaking Pace Trainer */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Timer className="w-5 h-5" />
                  Speaking Pace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{wpm}</div>
                    <div className="text-sm text-muted-foreground">Words Per Minute</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {getWpmFeedback()}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Optimal range: 130-160 WPM
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filler Word Challenge */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5" />
                  Filler Word Detector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{fillerCount}</div>
                    <div className="text-sm text-muted-foreground">Detected This Session</div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Common fillers: um, uh, like, you know, so
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live Feedback */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="w-5 h-5" />
                  Live Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {feedback.map((item, index) => (
                    <div
                      key={index}
                      className="text-xs p-2 rounded bg-muted/50 border border-border/50"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exercise Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Build Confidence</h3>
              <p className="text-sm text-muted-foreground">
                Practice speaking with clear, confident tone to improve your overall presence
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Timer className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Perfect Your Pace</h3>
              <p className="text-sm text-muted-foreground">
                Maintain 130-160 words per minute for optimal audience engagement
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Eliminate Fillers</h3>
              <p className="text-sm text-muted-foreground">
                Reduce "um", "uh", and "like" for more professional delivery
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Exercises;