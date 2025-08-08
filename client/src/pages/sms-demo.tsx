import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DreamCallOptIn from '../components/DreamCallOptIn';
import DreamCallLog from '../components/DreamCallLog';
import DreamReminderDashboard from '../components/DreamReminderDashboard';
// import { checkDreamMilestones } from '../../lib/dream-milestone-checker';

export default function SMSDemo() {
  const [testPhone, setTestPhone] = useState('+15555555555');
  const [testDreamId, setTestDreamId] = useState('dream047');
  const [testMessage, setTestMessage] = useState('You\'ve hit 3 remixes. Ready to evolve?');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestSMS = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/sms/test-dream-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone,
          dreamId: testDreamId,
          message: testMessage
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to send SMS' });
    } finally {
      setSending(false);
    }
  };

  const mockDream = {
    id: 'dream047',
    views: 1200,
    remixes: 6,
    evolutionPath: { generationLevel: 4 },
    viralityMetrics: { currentTrend: 'ascending' },
    aiScore: 88,
    collaborators: ['alice', 'bob', 'charlie'],
    flags: {}
  };

  const testMilestoneChecker = async () => {
    // Mock milestone checker for demo
    try {
      const mockResult = {
        message: 'Milestone check completed',
        triggeredFlags: ['viral_ready', 'evolution_candidate'],
        dream: { ...mockDream, flags: ['viral_ready', 'evolution_candidate'] }
      };
      setResult(mockResult);
    } catch (error) {
      setResult({ error: 'Milestone check failed' });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📱 Dream Network SMS System</h1>
        <p className="text-purple-300">Complete SMS notification system with Twilio integration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opt-In Component */}
        <Card className="bg-zinc-900 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white">📞 User Opt-In</CardTitle>
          </CardHeader>
          <CardContent>
            <DreamCallOptIn />
          </CardContent>
        </Card>

        {/* SMS Test Panel */}
        <Card className="bg-zinc-900 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white">🧪 Test SMS Sending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Phone number"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="bg-zinc-800 border-purple-600 text-white"
            />
            <Input
              placeholder="Dream ID"
              value={testDreamId}
              onChange={(e) => setTestDreamId(e.target.value)}
              className="bg-zinc-800 border-purple-600 text-white"
            />
            <Input
              placeholder="Message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="bg-zinc-800 border-purple-600 text-white"
            />
            <div className="flex gap-2">
              <Button 
                onClick={sendTestSMS}
                disabled={sending}
                className="bg-purple-700 hover:bg-purple-800"
              >
                {sending ? 'Sending...' : 'Send SMS'}
              </Button>
              <Button 
                onClick={testMilestoneChecker}
                variant="outline"
                className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
              >
                Test Milestones
              </Button>
            </div>
            
            {result && (
              <div className="mt-4 p-4 bg-black border border-purple-600 rounded-md">
                <pre className="text-xs text-green-400 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Log */}
      <Card className="bg-zinc-900 border-purple-700">
        <CardHeader>
          <CardTitle className="text-white">📋 SMS Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DreamCallLog />
        </CardContent>
      </Card>

      {/* System Documentation */}
      <Card className="bg-zinc-900 border-purple-700">
        <CardHeader>
          <CardTitle className="text-white">📚 SMS System Features</CardTitle>
        </CardHeader>
        <CardContent className="text-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">🎯 Milestone Triggers</h4>
              <ul className="text-sm space-y-1 text-purple-300">
                <li>• 5+ remixes → Evolution prompt</li>
                <li>• 1,000+ views → Leadership call</li>
                <li>• Viral trend → Strike-while-hot alert</li>
                <li>• Generation 3+ → Metamorphosis ready</li>
                <li>• AI Score 85+ → Special dream recognition</li>
                <li>• 3+ collaborators → Movement building</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">💬 Response Handling</h4>
              <ul className="text-sm space-y-1 text-purple-300">
                <li>• <span className="text-green-400">YES</span> → Trigger dream agent</li>
                <li>• <span className="text-yellow-400">LATER</span> → Schedule reminder</li>
                <li>• <span className="text-red-400">STOP</span> → Unsubscribe user</li>
                <li>• Unknown → Log for analysis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black border border-cyan-600 rounded-md">
            <h4 className="font-semibold text-cyan-400 mb-2">🔧 Integration Points</h4>
            <div className="text-sm space-y-2 text-purple-300">
              <p><strong>API Endpoints:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• <code>/api/sms/opt-in</code> - User registration</li>
                <li>• <code>/api/sms/webhook</code> - Twilio webhook</li>
                <li>• <code>/api/sms/test-dream-call</code> - Testing endpoint</li>
                <li>• <code>/api/dream-call-log</code> - Activity logs</li>
              </ul>
              <p className="mt-3"><strong>Required ENV Variables:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• <code>TWILIO_SID</code> - Account SID</li>
                <li>• <code>TWILIO_AUTH</code> - Auth token</li>
                <li>• <code>TWILIO_NUMBER</code> - Phone number</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dream Reminder Dashboard */}
      <DreamReminderDashboard />
    </div>
  );
}