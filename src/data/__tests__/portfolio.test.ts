import { describe, it, expect } from 'vitest'
import portfolioData from '@/data/portfolio'

describe('portfolioData', () => {
  it('has all required top-level keys', () => {
    const keys = ['about', 'experiences', 'projects', 'education', 'contact', 'github', 'resume', 'links']
    for (const key of keys) {
      expect(portfolioData).toHaveProperty(key)
    }
  })

  describe('resume section', () => {
    it('has required fields', () => {
      const { resume } = portfolioData
      expect(resume).toHaveProperty('name')
      expect(resume).toHaveProperty('summary')
      expect(resume).toHaveProperty('experiences')
      expect(resume).toHaveProperty('skills')
    })

    it('name is a non-empty string', () => {
      expect(typeof portfolioData.resume.name).toBe('string')
      expect(portfolioData.resume.name.length).toBeGreaterThan(0)
    })

    it('summary is a non-empty string', () => {
      expect(typeof portfolioData.resume.summary).toBe('string')
      expect(portfolioData.resume.summary.length).toBeGreaterThan(0)
    })

    it('skills is a non-empty string', () => {
      expect(typeof portfolioData.resume.skills).toBe('string')
      expect(portfolioData.resume.skills.length).toBeGreaterThan(0)
    })

    it('experiences is a non-empty array', () => {
      expect(Array.isArray(portfolioData.resume.experiences)).toBe(true)
      expect(portfolioData.resume.experiences.length).toBeGreaterThan(0)
    })
  })

  describe('experiences', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(portfolioData.experiences)).toBe(true)
      expect(portfolioData.experiences.length).toBeGreaterThan(0)
    })

    it('each experience has role, company, and period', () => {
      for (const exp of portfolioData.experiences) {
        expect(exp).toHaveProperty('role')
        expect(typeof exp.role).toBe('string')
        expect(exp.role.length).toBeGreaterThan(0)

        expect(exp).toHaveProperty('company')
        expect(typeof exp.company).toBe('string')
        expect(exp.company.length).toBeGreaterThan(0)

        expect(exp).toHaveProperty('period')
        expect(typeof exp.period).toBe('string')
        expect(exp.period.length).toBeGreaterThan(0)
      }
    })
  })
})
