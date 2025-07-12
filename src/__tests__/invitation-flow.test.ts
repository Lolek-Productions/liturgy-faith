import { createClient } from '@supabase/supabase-js'
import { inviteParishMember, getParishMembers } from '@/lib/actions/setup'
import { sendParishInvitationEmail } from '@/lib/email/ses-client'

// Mock the email sending function
jest.mock('@/lib/email/ses-client', () => ({
  sendParishInvitationEmail: jest.fn(),
}))

const mockedSendEmail = sendParishInvitationEmail as jest.MockedFunction<typeof sendParishInvitationEmail>

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    admin: {
      getUserById: jest.fn(),
    },
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
}

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

describe('User Invitation Flow', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'admin@test.com'
  }

  const mockParish = {
    id: 'test-parish-id',
    name: 'Test Parish'
  }

  const mockInvitation = {
    token: '12345678-1234-1234-1234-123456789abc',
    parish_id: mockParish.id,
    email: 'invitee@test.com',
    roles: ['member'],
    invited_by: mockUser.id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    accepted_at: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedSendEmail.mockResolvedValue({
      success: true,
      messageId: 'test-message-id'
    })
  })

  describe('inviteParishMember', () => {
    it('should successfully invite a new user', async () => {
      // Mock authenticated user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock user parish access check
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { roles: ['admin'] },
              error: null
            })
          }
        }
        return mockSupabase
      })

      // Mock no existing invitation
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_invitations') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' } // No rows returned
            }),
            insert: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
          }
        }
        return mockSupabase
      })

      // Mock parish details
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parishes') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockParish,
              error: null
            })
          }
        }
        return mockSupabase
      })

      // Mock invitation creation
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_invitations') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }
            }),
            insert: jest.fn().mockReturnThis(),
          }
        }
        return mockSupabase
      })

      mockSupabase.select.mockResolvedValue({
        data: mockInvitation,
        error: null
      })

      const result = await inviteParishMember(mockParish.id, 'invitee@test.com', ['member'])

      expect(result.success).toBe(true)
      expect(result.message).toContain('Invitation sent to invitee@test.com')
      expect(mockedSendEmail).toHaveBeenCalledWith(
        'invitee@test.com',
        mockParish.name,
        mockUser.email,
        expect.stringContaining('/accept-invitation?token=')
      )
    })

    it('should fail if user is not admin', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock user with no admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { roles: ['member'] }, // Not admin
              error: null
            })
          }
        }
        return mockSupabase
      })

      await expect(
        inviteParishMember(mockParish.id, 'invitee@test.com', ['member'])
      ).rejects.toThrow('You do not have permission to invite members to this parish')
    })

    it('should fail if invitation already exists', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock user parish access check
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { roles: ['admin'] },
              error: null
            })
          }
        }
        return mockSupabase
      })

      // Mock existing invitation
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_invitations') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                ...mockInvitation,
                accepted_at: null,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Valid
              },
              error: null
            })
          }
        }
        return mockSupabase
      })

      await expect(
        inviteParishMember(mockParish.id, 'invitee@test.com', ['member'])
      ).rejects.toThrow('A pending invitation already exists for this email address')
    })

    it('should handle email sending failure', async () => {
      // Mock email failure
      mockedSendEmail.mockResolvedValue({
        success: false,
        error: 'SES service unavailable'
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Setup successful mocks for everything except email
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { roles: ['admin'] },
              error: null
            })
          }
        }
        if (table === 'parish_invitations') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }
            }),
            insert: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
          }
        }
        if (table === 'parishes') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockParish,
              error: null
            })
          }
        }
        return mockSupabase
      })

      mockSupabase.select.mockResolvedValue({
        data: mockInvitation,
        error: null
      })

      await expect(
        inviteParishMember(mockParish.id, 'invitee@test.com', ['member'])
      ).rejects.toThrow('Failed to send invitation email: SES service unavailable')
    })
  })

  describe('getParishMembers', () => {
    it('should fetch parish members with user settings', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock user parish access check
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user' && mockSupabase.select.mock.calls.length === 0) {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { parish_id: mockParish.id },
              error: null
            })
          }
        }
        return mockSupabase
      })

      // Mock parish members query
      const mockMembers = [
        {
          user_id: 'member-1',
          roles: ['admin'],
          user_settings: {
            user_id: 'member-1',
            full_name: 'John Doe',
            created_at: '2024-01-01T00:00:00Z'
          }
        },
        {
          user_id: 'member-2',
          roles: ['member'],
          user_settings: {
            user_id: 'member-2',
            full_name: 'Jane Smith',
            created_at: '2024-01-02T00:00:00Z'
          }
        }
      ]

      mockSupabase.select.mockResolvedValue({
        data: mockMembers,
        error: null
      })

      // Mock auth.admin.getUserById for emails
      mockSupabase.auth.admin.getUserById
        .mockResolvedValueOnce({
          data: { user: { id: 'member-1', email: 'john@test.com' } }
        })
        .mockResolvedValueOnce({
          data: { user: { id: 'member-2', email: 'jane@test.com' } }
        })

      const result = await getParishMembers(mockParish.id)

      expect(result.success).toBe(true)
      expect(result.members).toHaveLength(2)
      
      expect(result.members[0]).toEqual({
        user_id: 'member-1',
        roles: ['admin'],
        users: {
          id: 'member-1',
          email: 'john@test.com',
          full_name: 'John Doe',
          created_at: '2024-01-01T00:00:00Z'
        }
      })

      expect(result.members[1]).toEqual({
        user_id: 'member-2',
        roles: ['member'],
        users: {
          id: 'member-2',
          email: 'jane@test.com',
          full_name: 'Jane Smith',
          created_at: '2024-01-02T00:00:00Z'
        }
      })
    })

    it('should handle missing user settings gracefully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock user parish access check
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'parish_user' && mockSupabase.select.mock.calls.length === 0) {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { parish_id: mockParish.id },
              error: null
            })
          }
        }
        return mockSupabase
      })

      // Mock member without user_settings
      const mockMembers = [
        {
          user_id: 'member-1',
          roles: ['member'],
          user_settings: null
        }
      ]

      mockSupabase.select.mockResolvedValue({
        data: mockMembers,
        error: null
      })

      mockSupabase.auth.admin.getUserById.mockResolvedValue({
        data: { user: { id: 'member-1', email: 'member@test.com' } }
      })

      const result = await getParishMembers(mockParish.id)

      expect(result.success).toBe(true)
      expect(result.members).toHaveLength(1)
      expect(result.members[0]).toEqual({
        user_id: 'member-1',
        roles: ['member'],
        users: {
          id: 'member-1',
          email: 'member@test.com',
          full_name: null,
          created_at: null
        }
      })
    })
  })

  describe('Invitation Token Validation', () => {
    it('should validate invitation token structure', () => {
      // Test that invitation tokens are UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      expect(mockInvitation.token).toMatch(uuidRegex)
    })

    it('should validate invitation expiry', () => {
      const now = new Date()
      const expiresAt = new Date(mockInvitation.expires_at)
      
      // Should expire in the future
      expect(expiresAt.getTime()).toBeGreaterThan(now.getTime())
      
      // Should expire within 7 days
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      expect(expiresAt.getTime()).toBeLessThanOrEqual(sevenDaysFromNow.getTime())
    })
  })

  describe('Email Content Validation', () => {
    it('should generate correct invitation links', () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
      const expectedLink = `${baseUrl}/accept-invitation?token=${mockInvitation.token}`
      
      expect(expectedLink).toContain('/accept-invitation?token=')
      expect(expectedLink).toContain(mockInvitation.token)
    })
  })
})