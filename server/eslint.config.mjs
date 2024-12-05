import baseConfig from '@hono/eslint-config'

export default [
  ...baseConfig,
  {
    // files: ['**/*.ts'],
    rules: {
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]