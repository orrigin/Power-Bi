import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  variant: 'blue' | 'green' | 'purple' | 'amber';
  isPositive?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant,
  isPositive,
}) => {
  const iconClassMap = {
    blue: 'kpi-icon-blue',
    green: 'kpi-icon-green',
    purple: 'kpi-icon-purple',
    amber: 'kpi-icon-amber',
  };

  return (
    <div className="kpi-card">
      <div>
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{value}</div>
        {subtext && (
          <div className="kpi-subtext">
            {isPositive !== undefined && (
              <span style={{ color: isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {isPositive ? '↑' : '↓'}
              </span>
            )}
            <span>{subtext}</span>
          </div>
        )}
      </div>

      <div className={`kpi-icon-container ${iconClassMap[variant]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

