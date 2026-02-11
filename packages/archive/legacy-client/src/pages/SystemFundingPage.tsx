import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Mail, Users, Clock, TrendingUp } from 'lucide-react';

// For now, we'll use a mock function until we can import directly or add an API route
// TODO: Replace with direct import or API call
// import { getFundingDashboardView } from '@dreamnet/wolfpack-funding-core/adapters/fundingStatusAdapter';

const FALLBACK_VIEW = {
  leadCount: 0,
  queueCount: 0,
  pendingCount: 0,
  hotLeadCount: 0,
  followUpDueCount: 0,
  grantDraftCount: 0,
  leads: [],
  queue: [],
  insights: [],
};

interface MetricCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  const { dreamNetMode } = useDreamNetTheme();
  return (
    <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface TableProps {
  headers: string[];
  rows: (string | number)[][];
}

function Table({ headers, rows }: TableProps) {
  const { dreamNetMode } = useDreamNetTheme();
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="min-w-full text-sm">
        <thead className={dreamNetMode ? 'bg-electric-cyan/10' : 'bg-slate-900/70'}>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className={`px-3 py-2 text-left text-xs font-semibold ${dreamNetMode ? 'text-electric-cyan' : 'text-slate-300'
                  }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cols, i) => (
            <tr key={i} className="border-t border-slate-800">
              {cols.map((c, j) => (
                <td key={j} className="px-3 py-2 text-slate-100/90">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SystemFundingPage() {
  const { dreamNetMode } = useDreamNetTheme();
  const [view, setView] = useState(FALLBACK_VIEW);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshView = async () => {
    setIsRefreshing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/api/ops/organism-status`);
      const data = await response.json();

      if (data.success && data.funding) {
        setView({
          leadCount: data.funding.leadCount || 0,
          queueCount: data.funding.queueCount || 0,
          pendingCount: data.funding.pendingCount || 0,
          hotLeadCount: data.funding.hotLeadCount || 0,
          followUpDueCount: data.funding.followUpDueCount || 0,
          grantDraftCount: data.funding.grantDraftsCount || 0,
          leads: data.funding.sampleLeads || [],
          queue: data.funding.sampleQueue || [],
          insights: [], // Future: data.funding.insights || []
        });
      }
    } catch (error) {
      console.error('[FundingPage] Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshView();
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshView, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'hot':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'qualified':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 ${dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
                }`}
            >
              Wolf Pack Funding Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Live view of funding leads and outreach queue managed by the Wolf Pack.
            </p>
          </div>
          <button
            onClick={refreshView}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-lg border ${dreamNetMode
              ? 'border-electric-cyan/30 bg-electric-cyan/10 hover:bg-electric-cyan/20 text-electric-cyan'
              : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
              } transition-colors flex items-center gap-2 disabled:opacity-50`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard label="Leads" value={view.leadCount} icon={<Users className="w-4 h-4" />} />
          <MetricCard
            label="Queue Items"
            value={view.queueCount}
            icon={<Mail className="w-4 h-4" />}
          />
          <MetricCard
            label="Pending"
            value={view.pendingCount}
            icon={<Clock className="w-4 h-4" />}
          />
          <MetricCard
            label="Hot Leads"
            value={view.hotLeadCount}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            label="Follow-Ups Due"
            value={view.followUpDueCount || 0}
            icon={<Clock className="w-4 h-4" />}
          />
          <MetricCard
            label="Grant Drafts"
            value={view.grantDraftCount || 0}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Leads */}
        <section className="mb-10">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
            <CardHeader>
              <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                Sample Leads
              </CardTitle>
              <CardDescription>
                Funding leads being tracked and scored by the Wolf Pack
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view.leads.length > 0 ? (
                <Table
                  headers={['ID', 'Name', 'Type', 'Stage', 'HOT', 'Priority', 'Email']}
                  rows={view.leads.map((l) => [
                    l.id,
                    l.name,
                    l.type,
                    <Badge key={`${l.id}-stage`} variant="outline" className={getStageBadgeColor(l.stage)}>
                      {l.stage}
                    </Badge>,
                    l.isHot ? (
                      <span
                        key={`${l.id}-hot`}
                        className="inline-flex items-center rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300 border border-red-500/30"
                      >
                        HOT
                      </span>
                    ) : (
                      <span key={`${l.id}-hot`}>-</span>
                    ),
                    l.priorityScore?.toFixed(2) ?? '-',
                    l.email ?? '-',
                  ])}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No leads yet. Seed some in WolfPackFundingCore.</p>
                  <p className="text-sm mt-2">
                    Run: <code className="bg-slate-800 px-2 py-1 rounded">tsx scripts/seedWolfpackTestLead.ts</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Queue */}
        <section>
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
            <CardHeader>
              <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                Send Queue
              </CardTitle>
              <CardDescription>
                Email queue items waiting to be sent or already processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {view.queue.length > 0 ? (
                <Table
                  headers={['ID', 'Lead', 'To', 'Subject', 'Status']}
                  rows={view.queue.map((q) => [
                    q.id,
                    q.leadId,
                    q.toEmail,
                    q.subject.length > 40 ? q.subject.substring(0, 40) + '...' : q.subject,
                    <Badge key={q.id} variant="outline" className={getStatusBadgeColor(q.status)}>
                      {q.status}
                    </Badge>,
                  ])}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Queue is empty.</p>
                  <p className="text-sm mt-2">
                    Run the funding cycle to generate queue items.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}

