import React from 'react';

const AudienceChart = ({ votes, letters }) => {
  return (
    <div className="audience-chart">
      <h4 className="chart-title">Ý kiến khán giả trường quay</h4>
      <div className="chart-bars">
        {votes.map((vote, idx) => (
          <div key={letters[idx]} className="chart-row">
            <span className="chart-label">{letters[idx]}: {vote}%</span>
            <div className="chart-bar-bg">
              <div
                className="chart-bar-fill"
                style={{ width: `${vote}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudienceChart;
