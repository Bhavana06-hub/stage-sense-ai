import { useState, useEffect } from "react";
import { BarChart3, Clock, TrendingUp, Award, Calendar, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SessionData {
  date: string;
  duration: number;
  confidenceScore: number;
  wpm: number;
  volume: number;
  feedback: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [averageWPM, setAverageWPM] = useState(0);

  useEffect(() => {
    // Load session data from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('speechSenseSessions') || '[]');
    
    // Add mock data if no real sessions exist
    if (savedSessions.length === 0) {
      const mockSessions = [
        {
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          duration: 180,
          confidenceScore: 87,
          wpm: 152,
          volume: 78,
          feedback: [
            { type: "positive", message: "Great eye contact!", timestamp: "02:15" },
            { type: "warning", message: "Slow down a bit", timestamp: "01:30" }
          ]
        },
        {
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          duration: 240,
          confidenceScore: 82,
          wpm: 145,
          volume: 85,
          feedback: [
            { type: "positive", message: "Confident delivery", timestamp: "03:20" },
            { type: "positive", message: "Good volume control", timestamp: "02:45" }
          ]
        },
        {
          date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          duration: 165,
          confidenceScore: 78,
          wpm: 138,
          volume: 72,
          feedback: [
            { type: "warning", message: "Increase volume", timestamp: "01:45" },
            { type: "positive", message: "Good pace", timestamp: "02:30" }
          ]
        }
      ];
      setSessions(mockSessions);
      localStorage.setItem('speechSenseSessions', JSON.stringify(mockSessions));
    } else {
      setSessions(savedSessions);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      setTotalSessions(sessions.length);
      setTotalTime(sessions.reduce((sum, session) => sum + session.duration, 0));
      setAverageConfidence(sessions.reduce((sum, session) => sum + session.confidenceScore, 0) / sessions.length);
      setAverageWPM(sessions.reduce((sum, session) => sum + session.wpm, 0) / sessions.length);
    }
  }, [sessions]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "🏆 Excellent";
    if (score >= 80) return "⭐ Great";
    if (score >= 70) return "👍 Good";
    return "📈 Improving";
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your presentation skills progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Practice Time</p>
                  <p className="text-2xl font-bold text-foreground">{formatDuration(totalTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(averageConfidence)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg WPM</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(averageWPM)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Confidence Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 5).reverse().map((session, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-muted-foreground">
                        {formatDate(session.date).split(',')[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confidence Score</span>
                          <span className={`font-medium ${getScoreColor(session.confidenceScore)}`}>
                            {session.confidenceScore}%
                          </span>
                        </div>
                        <Progress value={session.confidenceScore} className="h-2" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {sessions.length === 0 && (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No sessions yet</h3>
                    <p className="text-muted-foreground mb-4">Start practicing to see your progress here</p>
                    <Link to="/practice">
                      <Button variant="hero">Start First Session</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(session.date)}
                        </div>
                        <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {getScoreBadge(session.confidenceScore)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Duration:</span>
                          <span className="font-medium">{formatDuration(session.duration)}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Confidence:</span>
                          <span className={`font-medium ${getScoreColor(session.confidenceScore)}`}>
                            {session.confidenceScore}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>WPM:</span>
                          <span className="font-medium">{session.wpm}</span>
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-border/30">
                          <div className="text-xs text-muted-foreground mb-1">Key Feedback:</div>
                          {session.feedback.slice(0, 2).map((feedback, feedbackIndex) => (
                            <div key={feedbackIndex} className="text-xs truncate">
                              <span className={feedback.type === 'positive' ? 'text-green-600' : 'text-yellow-600'}>
                                {feedback.type === 'positive' ? '✓' : '⚠'} {feedback.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sessions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">No sessions recorded yet</p>
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

export default Dashboard;