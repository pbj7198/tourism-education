import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About 페이지', () => {
  it('제목이 올바르게 렌더링되어야 함', () => {
    render(<About />);
    expect(screen.getByText('한국관광교육연구회 소개')).toBeInTheDocument();
  });

  it('주요 활동 목록이 표시되어야 함', () => {
    render(<About />);
    expect(screen.getByText('교육과정 연구 및 개발')).toBeInTheDocument();
    expect(screen.getByText('교수학습 자료 공유')).toBeInTheDocument();
    expect(screen.getByText('교사 연수 및 워크샵 진행')).toBeInTheDocument();
    expect(screen.getByText('관광 산업 현장과의 연계 활동')).toBeInTheDocument();
  });
}); 