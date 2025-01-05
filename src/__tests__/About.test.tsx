/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../pages/About';

describe('About 페이지', () => {
  it('제목이 올바르게 렌더링되어야 함', () => {
    render(<About />);
    const heading = screen.getByText('한국관광교육연구회 소개');
    expect(heading).toBeInTheDocument();
  });

  it('주요 활동 목록이 표시되어야 함', () => {
    render(<About />);
    const activities = [
      '교육과정 연구 및 개발',
      '교수학습 자료 공유',
      '교사 연수 및 워크샵 진행',
      '관광 산업 현장과의 연계 활동'
    ];

    activities.forEach(activity => {
      expect(screen.getByText(activity)).toBeInTheDocument();
    });
  });
}); 