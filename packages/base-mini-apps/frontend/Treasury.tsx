import React, { useState, useEffect } from 'react';
import { EconomicEngineCore } from '@dreamnet/economic-engine-core';
import { DreamStateCore } from '@dreamnet/dream-state-core';

export function Treasury() {
  const [treasury, setTreasury] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      // Get economic engine status
      const econStatus = EconomicEngineCore.getStatus();
      setTreasury(econStatus);

      // Get government departments
      const depts = DreamStateCore.listDepartments();
      setDepartments(depts);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="miniapp-treasury">
      <div className="app-header">
        <h1>💎 DreamNet Treasury</h1>
        <p>View Dream State treasury, budgets, and economic activity</p>
      </div>

      <div className="treasury-overview">
        <div className="stat-card large">
          <h2>Total Treasury</h2>
          <p className="stat-value">${treasury?.totalBalance?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="departments-section">
        <h2>Government Departments</h2>
        <div className="departments-list">
          {departments.map((dept) => (
            <div key={dept.id} className="dept-card">
              <h3>{dept.name}</h3>
              <p>Budget: ${dept.budget?.toFixed(2) || 'N/A'}</p>
              <ul>
                {dept.responsibilities.map((resp: string, i: number) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

