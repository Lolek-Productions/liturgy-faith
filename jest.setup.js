// Setup for Jest tests
require('dotenv').config({ path: '.env.local' })

// Mock Next.js modules that aren't available in test environment
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))