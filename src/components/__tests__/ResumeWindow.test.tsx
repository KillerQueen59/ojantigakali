import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResumeWindow from '@/components/windows/ResumeWindow'
import type { ResumeData } from '@/types/portfolio'

const mockData: ResumeData = {
  name: 'Jane Doe',
  subtitle: 'Software Engineer · jane@example.com',
  summary: 'Experienced engineer with a passion for clean code.',
  experiences: [
    { role: 'Senior Engineer', company: 'Acme Corp', period: 'Jan 2020 – Present' },
    { role: 'Junior Engineer', company: 'Beta Inc', period: 'Jun 2018 – Dec 2019' },
  ],
  skills: 'TypeScript · React · Go · PostgreSQL',
}

describe('ResumeWindow', () => {
  it('renders the candidate name', () => {
    render(<ResumeWindow data={mockData} />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('renders the summary', () => {
    render(<ResumeWindow data={mockData} />)
    expect(screen.getByText(mockData.summary)).toBeInTheDocument()
  })

  it('renders all experience entries', () => {
    render(<ResumeWindow data={mockData} />)
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Jan 2020 – Present')).toBeInTheDocument()

    expect(screen.getByText('Junior Engineer')).toBeInTheDocument()
    expect(screen.getByText('Beta Inc')).toBeInTheDocument()
    expect(screen.getByText('Jun 2018 – Dec 2019')).toBeInTheDocument()
  })

  it('renders the skills', () => {
    render(<ResumeWindow data={mockData} />)
    expect(screen.getByText(mockData.skills)).toBeInTheDocument()
  })

  it('download link points to the correct PDF path', () => {
    render(<ResumeWindow data={mockData} />)
    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toHaveAttribute('href', '/files/10282025 CV_Muhammad Fauzan Ramadhan.pdf')
  })

  it('download attribute has the clean filename', () => {
    render(<ResumeWindow data={mockData} />)
    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toHaveAttribute('download', 'CV_Muhammad Fauzan Ramadhan.pdf')
  })

  it('falls back to default name when data is null', () => {
    render(<ResumeWindow data={null} />)
    expect(screen.getByText('Muhammad Fauzan Ramadhan')).toBeInTheDocument()
  })
})
